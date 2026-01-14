# Copilot Free - Extensão Chrome

## 📋 Sobre

Extensão Chrome que funciona como um agente de automação para tarefas diárias no navegador. Permite:

- ✅ Analisar páginas web
- ✅ Capturar screenshots
- ✅ Preencher formulários
- ✅ Clicar em elementos
- ✅ Navegar entre páginas
- ✅ Executar scripts personalizados

## 🚀 Instalação

### 1. Baixar a Extensão

```bash
# Clone o repositório
git clone https://github.com/lexisvirtual/copilot-free.git

# Ou baixe o ZIP e extraia
```

### 2. Instalar no Chrome

1. Abra o Chrome e acesse: `chrome://extensions/`
2. Ative o **Modo desenvolvedor** (canto superior direito)
3. Clique em **Carregar sem compactação**
4. Selecione a pasta `extension/` do projeto
5. A extensão será instalada e aparecerá na barra de ferramentas

### 3. Usar a Extensão

1. Clique no ícone da extensão na barra
2. O painel lateral será aberto
3. Digite sua solicitação e clique em **Enviar**
4. O agente executará as ações automaticamente

## 🎯 Exemplos de Uso

```
"Analise esta página e me diga do que se trata"
"Tire um screenshot desta página"
"Preencha o formulário com meus dados"
"Navegue até a próxima página"
"Clique no botão de enviar"
```

## 🔧 Arquivos

- `manifest.json` - Configuração da extensão
- `background.js` - Service worker (gerencia requisições)
- `content.js` - Script injetado nas páginas
- `sidebar.html` - Interface do painel lateral
- `sidebar.css` - Estilos do painel
- `sidebar.js` - Lógica do painel

## 🔐 Permissões

A extensão requer:
- `activeTab` - Acessar a aba atual
- `tabs` - Gerenciar abas
- `storage` - Salvar configurações
- `scripting` - Executar scripts
- `sidePanel` - Exibir painel lateral
- `<all_urls>` - Acessar qualquer site

## 🌐 Backend

A extensão se conecta ao Worker do Cloudflare:
```
https://copilot-assistant.lexis-english-account.workers.dev
```

## 📝 Desenvolvimento

Para modificar a extensão:

1. Edite os arquivos na pasta `extension/`
2. Volte para `chrome://extensions/`
3. Clique no botão de **Recarregar** da extensão
4. Teste as mudanças

## ⚠️ Importante

- Use apenas em sites que você tem permissão
- Respeite os termos de serviço dos sites
- A extensão é para uso pessoal e produtividade
- 100% GRATUITO - sem limites de crédito

## 📧 Suporte

Dúvidas ou problemas? Abra uma issue no GitHub!
