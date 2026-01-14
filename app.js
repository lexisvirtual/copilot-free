// Configuração - Alterar após criar o Worker
const WORKER_URL = 'https://SEU-WORKER.workers.dev/assist';

const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const quickActions = document.querySelectorAll('.quick-action');

// Função para adicionar mensagem ao chat
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Função para enviar mensagem ao backend
async function sendMessage(message) {
    if (!message.trim()) return;
    
    // Adiciona mensagem do usuário
    addMessage(message, true);
    userInput.value = '';
    
    // Adiciona indicador de loading
    addMessage('Pensando...', false);
    
    try {
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                timestamp: new Date().toISOString()
            })
        });
        
        if (!response.ok) {
            throw new Error('Erro na resposta do servidor');
        }
        
        const data = await response.json();
        
        // Remove o "Pensando..."
        messagesDiv.removeChild(messagesDiv.lastChild);
        
        // Adiciona resposta do assistente
        addMessage(data.reply || 'Desculpe, não consegui processar sua solicitação.', false);
        
    } catch (error) {
        // Remove o "Pensando..."
        messagesDiv.removeChild(messagesDiv.lastChild);
        
        addMessage('❌ Erro: Verifique se o Worker está configurado corretamente. ' + error.message, false);
    }
}

// Event listeners
sendBtn.addEventListener('click', () => {
    sendMessage(userInput.value);
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(userInput.value);
    }
});

// Ações rápidas
quickActions.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        let prompt = '';
        
        switch(action) {
            case 'anuncio-facebook':
                prompt = 'Crie um anúncio completo para Facebook Ads com headline, descrição e CTA';
                break;
            case 'anuncio-google':
                prompt = 'Crie um anúncio para Google Ads com título, descrição e palavras-chave';
                break;
            case 'landing-page':
                prompt = 'Crie uma estrutura de landing page de alta conversão em HTML';
                break;
            case 'editar-html':
                prompt = 'Me ajude a revisar e melhorar meu código HTML';
                break;
            case 'copy-marketing':
                prompt = 'Crie um copy persuasivo para marketing digital';
                break;
        }
        
        userInput.value = prompt;
        userInput.focus();
    });
});

// Mensagem de boas-vindas
addMessage('👋 Olá! Sou seu assistente gratuito de marketing. Como posso ajudar hoje?', false);
