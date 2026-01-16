// Content Script - Injetado em todas as páginas
console.log('Copilot Agent: content script carregado');

// Listener para mensagens
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CAPTURE_CONTEXT') {
    sendResponse(captureContext());
    return true;
  }
  
  if (message.type === 'DO_ACTION') {
    const result = executeAction(message.action);
    sendResponse(result);
    return true;
  }
});

// Captura contexto da página
function captureContext() {
  return {
    url: window.location.href,
    title: document.title,
    text: document.body.innerText.substring(0, 3000),
    dom: getInteractiveElements(),
    inputs: getInputs(),
    buttons: getButtons()
  };
}

// Pega elementos interativos
function getInteractiveElements() {
  const elements = [];
  document.querySelectorAll('button, a, input, textarea, select').forEach((el, i) => {
    if (i < 30) {
      elements.push({
        tag: el.tagName,
        text: el.innerText?.substring(0, 40) || el.value || '',
        id: el.id,
        type: el.type
      });
    }
  });
  return elements;
}

// Pega inputs
function getInputs() {
  const inputs = [];
  document.querySelectorAll('input, textarea').forEach((el, i) => {
    if (i < 20) {
      inputs.push({
        type: el.type || 'text',
        placeholder: el.placeholder,
        name: el.name,
        id: el.id
      });
    }
  });
  return inputs;
}

// Pega botões
function getButtons() {
  const buttons = [];
  document.querySelectorAll('button, [role="button"]').forEach((el, i) => {
    if (i < 20) {
      buttons.push({
        text: el.innerText?.substring(0, 40) || '',
        id: el.id
      });
    }
  });
  return buttons;
}

// Executa ação
function executeAction(action) {
  try {
    if (action.type === 'click') {
      return clickElement(action.selector);
    }
    if (action.type === 'type') {
      return typeText(action.selector, action.text);
    }
    if (action.type === 'scroll') {
      window.scrollBy(0, action.amount || 300);
      return { success: true, message: 'Rolou a página' };
    }
    return { success: false, error: 'Ação desconhecida' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Clica em elemento
function clickElement(selector) {
  const el = findElement(selector);
  if (!el) return { success: false, error: 'Elemento não encontrado' };
  el.click();
  return { success: true, message: 'Clicado!' };
}

// Digita texto
function typeText(selector, text) {
  const el = findElement(selector);
  if (!el) return { success: false, error: 'Campo não encontrado' };
  el.value = text;
  el.dispatchEvent(new Event('input', { bubbles: true }));
  return { success: true, message: 'Texto digitado!' };
}

// Encontra elemento
function findElement(selector) {
  // Tenta seletor CSS
  let el = document.querySelector(selector);
  if (el) return el;
  
  // Tenta por texto
  const all = Array.from(document.querySelectorAll('button, a, input, textarea'));
  return all.find(e => e.innerText?.toLowerCase().includes(selector.toLowerCase()) || 
                        e.placeholder?.toLowerCase().includes(selector.toLowerCase()));
}


// ========================================
// EXECUTOR DE PLANOS (MÚTIPLAS AÇÕES)
// ========================================

// Adiciona listener para executar plano completo
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'EXECUTE_PLAN') {
    executePlan(message.steps)
      .then(results => sendResponse({ success: true, results }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Mantém canal aberto para async
  }
});

// Executa plano de ações em sequência
async function executePlan(steps) {
  const results = [];
  
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    console.log(`Executando passo ${i + 1}/${steps.length}:`, step);
    
    try {
      const result = await executeStep(step);
      results.push({ step: i + 1, action: step.action, result });
      
      // Pequena pausa entre ações
      await sleep(300);
    } catch (error) {
      console.error(`Erro no passo ${i + 1}:`, error);
      results.push({ step: i + 1, action: step.action, error: error.message });
    }
  }
  
  return results;
}

// Executa uma ação individual
async function executeStep(step) {
  switch (step.action) {
    case 'click':
      return executeClick(step.selector);
      
    case 'fill':
      return executeFill(step.selector, step.value);
      
    case 'scroll':
      return executeScroll(step.direction, step.amount);
      
    case 'navigate':
      return executeNavigate(step.url);
      
    case 'screenshot':
      return { success: true, message: 'Screenshot solicitado' };
      
    case 'wait':
      await sleep(step.ms || 1000);
      return { success: true, message: `Aguardou ${step.ms || 1000}ms` };
      
    default:
      throw new Error(`Ação desconhecida: ${step.action}`);
  }
}

// Executa clique
function executeClick(selector) {
  const el = findElement(selector);
  if (!el) throw new Error(`Elemento não encontrado: ${selector}`);
  
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.click();
  
  return { success: true, message: `Clicado em: ${selector}` };
}

// Executa preenchimento
function executeFill(selector, value) {
  const el = findElement(selector);
  if (!el) throw new Error(`Campo não encontrado: ${selector}`);
  
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.focus();
  el.value = value;
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
  
  return { success: true, message: `Preenchido: ${selector} = ${value}` };
}

// Executa scroll
function executeScroll(direction, amount) {
  const scrollAmount = amount || 500;
  const multiplier = direction === 'up' ? -1 : 1;
  
  window.scrollBy({
    top: scrollAmount * multiplier,
    behavior: 'smooth'
  });
  
  return { success: true, message: `Rolou ${direction} ${scrollAmount}px` };
}

// Executa navegação (via background)
function executeNavigate(url) {
  chrome.runtime.sendMessage({ type: 'NAVIGATE_TO', url });
  return { success: true, message: `Navegando para: ${url}` };
}

// Função auxiliar sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
