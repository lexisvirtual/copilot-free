# 🚀 Guia de Instalação Passo a Passo - Copilot Free

## 🎯 O que você vai fazer:

1. Instalar o Wrangler CLI (ferramenta do Cloudflare)
2. Fazer login no Cloudflare
3. Fazer deploy do Worker com IA
4. Instalar a extensão Chrome
5. Testar tudo funcionando!

---

## 💻 Passo 1: Instalar Node.js (se não tiver)

### Windows:
1. Baixe o Node.js: https://nodejs.org/
2. Instale a versão LTS (recomendada)
3. Abra o PowerShell ou CMD e teste:
```bash
node --version
npm --version
```

### Linux/Mac:
```bash
# Verifica se já tem Node.js
node --version

# Se não tiver, instale:
# Ubuntu/Debian:
sudo apt install nodejs npm

# Mac:
brew install node
```

---

## 🔧 Passo 2: Instalar o Wrangler

Abra o terminal e execute:

```bash
npm install -g wrangler
```

✅ Aguarde a instalação terminar.

✅ Teste se funcionou:
```bash
wrangler --version
```

---

## 🔑 Passo 3: Fazer Login no Cloudflare

```bash
wrangler login
```

✅ Uma janela do navegador vai abrir
✅ Faça login com sua conta Cloudflare (mesma que você usou para criar o Worker)
✅ Autorize o Wrangler
✅ Volte para o terminal

---

## 📦 Passo 4: Clonar o Repositório

```bash
# Clone o projeto
git clone https://github.com/lexisvirtual/copilot-free.git

# Entre na pasta
cd copilot-free
```

---

## 🚀 Passo 5: Fazer Deploy do Worker com IA

### 👉 ESTE É O PASSO MAIS IMPORTANTE!

```bash
# Dentro da pasta copilot-free, execute:
wrangler deploy
```

✅ O Wrangler vai:
- Ler o arquivo `wrangler.toml`
- Configurar o Workers AI automaticamente
- Fazer deploy do Worker
- Te dar a URL final

✅ **Guarde a URL que aparecer!** Vai ser algo como:
```
https://copilot-assistant.lexis-english-account.workers.dev
```

---

## 🌐 Passo 6: Testar o Worker

Teste se o Worker está funcionando:

```bash
curl -X POST https://copilot-assistant.lexis-english-account.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"message": "Olá, você está funcionando?"}'
```

✅ Se retornar uma resposta em JSON, **funcionou!**

---

## 🧩 Passo 7: Instalar a Extensão Chrome

### 1. Abra o Chrome

### 2. Vá para:
```
chrome://extensions/
```

### 3. Ative o "Modo desenvolvedor"
- Clique no toggle no canto superior direito

### 4. Clique em "Carregar sem compactação"

### 5. Navegue até a pasta `extension/` do projeto
- Exemplo: `C:\Users\SeuNome\copilot-free\extension`

### 6. Selecione a pasta e clique em "Selecionar pasta"

✅ A extensão aparecerá instalada!

---

## ⚙️ Passo 8: Configurar a URL do Worker na Extensão

### Opção A: Editar o arquivo sidebar.js

1. Abra o arquivo: `extension/sidebar.js`
2. Na linha 3, altere a URL:

```javascript
const WORKER_URL = 'https://SUA-URL-AQUI.workers.dev';
```

3. Salve o arquivo
4. Volte para `chrome://extensions/`
5. Clique no botão 🔄 **Recarregar** da extensão

### Opção B: Já está configurada!
Se você está usando a URL padrão:
```
https://copilot-assistant.lexis-english-account.workers.dev
```

Já está funcionando! Não precisa mudar nada.

---

## ✅ Passo 9: Testar Tudo Funcionando!

### 1. Clique no ícone da extensão no Chrome
- O painel lateral vai abrir

### 2. Digite um comando:
```
"Olá! Você está funcionando?"
```

### 3. Clique em "Enviar"

### 4. Aguarde a resposta

✅ **Se receber uma resposta, FUNCIONOU!** 🎉

---

## 🎯 Comandos para Testar:

```
"Analise esta página e me diga do que se trata"

"Tire um screenshot desta página"

"Me ajude a criar uma landing page para vender curso online"

"Como posso automatizar a publicação de anúncios no Facebook?"
```

---

## ❗ Resolvendo Problemas

### Erro: "Only POST allowed"
✅ Normal! Significa que o Worker está funcionando.
Você precisa enviar um POST, não GET.

### Erro: "AI binding not found"
❌ O Wrangler não configurou o Workers AI
✅ Solução: Execute novamente:
```bash
wrangler deploy
```

### Erro: "manifest.json não encontrado"
❌ Você não selecionou a pasta correta
✅ Certifique-se de selecionar a pasta `extension/` onde tem o `manifest.json`

### Extensão não responde
❌ A URL do Worker pode estar errada
✅ Verifique a URL no arquivo `extension/sidebar.js`
✅ Recarregue a extensão após mudar

---

## 💰 Custos: R$ 0,00/mês

- ✅ GitHub Pages: GRATUITO
- ✅ Cloudflare Workers: GRATUITO (100.000 requests/dia)
- ✅ Workers AI: GRATUITO (tier normal)

**Total: R$ 0,00/mês** 🎉

---

## 📧 Suporte

Problemas? Abra uma [issue no GitHub](https://github.com/lexisvirtual/copilot-free/issues)!

---

## 🎆 Parabéns!

Você agora tem um **agente de automação web com IA 100% gratuito** funcionando como o Comet! 🎉

Bom trabalho! 🚀
