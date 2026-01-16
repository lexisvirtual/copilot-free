// Background Service Worker - Gerencia comunicação e coordenação

// Listener para quando a extensão é instalada
chrome.runtime.onInstalled.addListener(() => {
  console.log('Copilot Free Agent instalado!');
});

// Listener para cliques no ícone da extensão
chrome.action.onClicked.addListener((tab) => {
  // Abre o side panel
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// Listener para mensagens de outros componentes
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background recebeu:', message);

  if (message.type === 'GET_PAGE_CONTEXT') {
    // Solicita contexto da página ao content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'CAPTURE_CONTEXT' }, (response) => {
          sendResponse(response);
        });
      }
    });
    return true; // Mantém o canal aberto para resposta assíncrona
  }

  if (message.type === 'EXECUTE_ACTION') {
    // Executa ação na página ativa
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'DO_ACTION',
          action: message.action
        }, (response) => {
          sendResponse(response);
        });
      }
    });
    return true;
  }

  if (message.type === 'TAKE_SCREENSHOT') {
    // Tira screenshot da aba atual
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
      sendResponse({ screenshot: dataUrl });
    });
    return true;
  }

  if (message.type === 'NAVIGATE_TO') {
    // Navega para uma URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.update(tabs[0].id, { url: message.url }, () => {
          sendResponse({ success: true });
        });
      }
    });
    return true;
  }
});

// Listener para mudanças de aba
chrome.tabs.onActivated.addListener((activeInfo) => {
  // Notifica o sidebar sobre mudança de aba
  chrome.runtime.sendMessage({
    type: 'TAB_CHANGED',
    tabId: activeInfo.tabId
  }).catch(() => {}); // Ignora erros se sidebar não estiver aberto
});

// Listener para atualizações de aba
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // Notifica quando página carregou
    chrome.runtime.sendMessage({
      type: 'PAGE_LOADED',
      tabId: tabId,
      url: tab.url
    }).catch(() => {});
  }
});

// ========================================
// FUNÇÕES PARA O AGENTE TIPO COMET
// ========================================

// URL do Worker Cloudflare (substitua pela sua URL)
const WORKER_URL = 'https://copilot-free.seu-usuario.workers.dev';

// Função para chamar o agente no Worker
async function callAgent(pageContext, userCommand) {
  try {
    const response = await fetch(`${WORKER_URL}/agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pageContext,
        userCommand
      })
    });

    if (!response.ok) {
      throw new Error(`Worker error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao chamar Worker:', error);
    return {
      error: error.message,
      reply: 'Erro ao se conectar com o agente.'
    };
  }
}

// Adiciona listener para comandos do agente
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CALL_AGENT') {
    // Primeiro pega o contexto da página
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]) {
        // Solicita contexto ao content script
        chrome.tabs.sendMessage(tabs[0].id, { type: 'CAPTURE_CONTEXT' }, async (pageContext) => {
          if (!pageContext) {
            sendResponse({ error: 'Não foi possível capturar o contexto da página' });
            return;
          }

          // Chama o Worker com o contexto e comando
          const agentResponse = await callAgent(pageContext, message.userCommand);
          
          // Retorna a resposta para quem chamou (sidebar)
          sendResponse(agentResponse);
        });
      }
    });
    return true; // Mantém o canal aberto para resposta assíncrona
  }
});
