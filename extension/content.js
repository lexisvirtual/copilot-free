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
