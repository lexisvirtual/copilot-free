// Sidebar - Lógica da interface
const WORKER_URL = 'https://copilot-assistant.lexis-english-account.workers.dev';

const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const statusBar = document.getElementById('status');
const urlDisplay = document.getElementById('current-url');
const refreshBtn = document.getElementById('refresh-context');
const quickBtns = document.querySelectorAll('.quick-btn');

let currentContext = null;

// Inicializa
init();

function init() {
  addMessage('👋 Olá! Sou seu agente autônomo. Posso clicar, preencher formulários e navegar!', 'agent');
  loadPage();
  
  sendBtn.addEventListener('click', handleSend);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });
  
  refreshBtn.addEventListener('click', loadPage);
  
  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => handleQuick(btn.dataset.action));
  });
}

// Adiciona mensagem
function addMessage(text, type = 'agent') {
  const div = document.createElement('div');
  div.className = `message ${type}`;
  div.textContent = text;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Carrega contexto da página
async function loadPage() {
  try {
    setStatus('Carregando...');
    const response = await chrome.runtime.sendMessage({ type: 'GET_PAGE_CONTEXT' });
    if (response) {
      currentContext = response;
      urlDisplay.textContent = response.url;
      setStatus('Pronto');
    }
  } catch (error) {
    setStatus('Erro');
  }
}

// Envia mensagem
async function handleSend() {
  const msg = userInput.value.trim();
  if (!msg) return;
  
  addMessage(msg, 'user');
  userInput.value = '';
  sendBtn.disabled = true;
  setStatus('Processando...');
  
  try {
    // Envia para Worker
    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg, context: currentContext })
    });
    
    const data = await response.json();
    
    // Se tem ação para executar
    if (data.action) {
      await executeAction(data.action);
    }
    
    addMessage(data.reply || 'Feito!', 'agent');
    
  } catch (error) {
    addMessage('❌ Erro: ' + error.message, 'system');
  } finally {
    sendBtn.disabled = false;
    setStatus('Pronto');
  }
}

// Executa ação
async function executeAction(action) {
  setStatus(`Executando: ${action.type}...`);
  
  try {
    const response = await chrome.runtime.sendMessage({
      type: 'EXECUTE_ACTION',
      action: action
    });
    
    if (response && response.success) {
      addMessage(`✅ ${response.message}`, 'system');
    } else {
      addMessage(`❌ ${response.error}`, 'system');
    }
    
    setTimeout(() => loadPage(), 1000);
    
  } catch (error) {
    addMessage(`❌ Erro: ${error.message}`, 'system');
  }
}

// Ações rápidas
async function handleQuick(action) {
  if (action === 'analyze') {
    if (!currentContext) return;
    const info = `📊 Página: ${currentContext.title}\n🔗 URL: ${currentContext.url}\n🔘 Elementos: ${currentContext.dom?.length || 0}\n📝 Inputs: ${currentContext.inputs?.length || 0}`;
    addMessage(info, 'agent');
  }
  
  if (action === 'screenshot') {
    try {
      await chrome.runtime.sendMessage({ type: 'TAKE_SCREENSHOT' });
      addMessage('📸 Screenshot capturado!', 'system');
    } catch (e) {
      addMessage('❌ Erro ao capturar', 'system');
    }
  }
  
  if (action === 'extract') {
    if (!currentContext || !currentContext.text) return;
    addMessage(`📄 Texto:\n${currentContext.text.substring(0, 400)}...`, 'agent');
  }
  
  if (action === 'fill') {
    if (!currentContext || !currentContext.inputs || currentContext.inputs.length === 0) {
      addMessage('❌ Nenhum formulário encontrado', 'system');
      return;
    }
    addMessage('📝 Formulário detectado! Me diga o que preencher.', 'agent');
    userInput.value = 'Preencher: ';
    userInput.focus();
  }
}

// Atualiza status
function setStatus(text) {
  statusBar.textContent = text;
}
