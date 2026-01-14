# 🤖 Copilot Free - Agente de Automação Gratuito

**Assistente copilot 100% GRATUITO para marketing, HTML e tarefas no navegador**

🌐 **Demo**: [https://lexisvirtual.github.io/copilot-free/](https://lexisvirtual.github.io/copilot-free/)

---

## 💡 O Que É?

Um agente de automação completo e gratuito que funciona como o Comet, permitindo:

- ✅ **Atualizar páginas HTML** automaticamente
- ✅ **Criar landing pages** sob demanda
- ✅ **Publicar anúncios** no Facebook e Google
- ✅ **Automatizar tarefas** do dia a dia no navegador
- ✅ **Sem limites de crédito** - 100% gratuito!

## 🎯 Por Que Usar?

- **⚡ Sem custo de infraestrutura** - GitHub Pages + Cloudflare Workers (tier gratuito)
- **💸 Sem parar no meio do dia** - Não tem limite de créditos
- **🔧 Fácil de usar** - Interface web + extensão Chrome
- **🚀 Deploy automático** - Basta fazer commit e está no ar

## 📐 Arquitetura

```
┌───────────────────────┐
│   FRONTEND (Gratuito)    │
│  GitHub Pages (HTML)     │ ← Interface web
│  Extensão Chrome         │ ← Agente no navegador
└────────────┬─────────┘
              │
              │ API requests
              │
┌─────────────┴─────────┐
│   BACKEND (Gratuito)     │
│  Cloudflare Workers      │ ← Lógica do agente
│  (100k requests/dia)     │ ← Processa comandos
└───────────────────────┘
```

## 🚀 Como Usar

### Opção 1: Interface Web

1. Acesse: [https://lexisvirtual.github.io/copilot-free/](https://lexisvirtual.github.io/copilot-free/)
2. Digite seu comando
3. Clique em "Enviar"
4. Receba a resposta do agente

### Opção 2: Extensão Chrome (Recomendado)

Para controlar seu navegador como o Comet:

1. Clone este repositório:
```bash
git clone https://github.com/lexisvirtual/copilot-free.git
```

2. Instale a extensão:
   - Abra `chrome://extensions/`
   - Ative o **Modo desenvolvedor**
   - Clique em **Carregar sem compactação**
   - Selecione a pasta `extension/`

3. Use o agente:
   - Clique no ícone da extensão
   - Digite seus comandos no painel lateral
   - O agente executará as ações automaticamente

📚 [Documentação completa da extensão](./extension/README.md)

## 💻 Exemplos de Uso

### Marketing
```
"Crie uma landing page para produto X"
"Publique anúncio no Facebook com esta copy"
"Atualize o título da página principal"
```

### Automação Web
```
"Analise esta página e me diga do que se trata"
"Preencha o formulário com meus dados"
"Tire um screenshot desta página"
"Clique no botão de enviar"
```

## 🛠️ Configuração do Backend

### Cloudflare Worker

1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com)
2. Vá em **Workers & Pages** → **Create Worker**
3. Cole o código do arquivo `wrangler.toml`
4. Deploy
5. Use a URL gerada na extensão

### GitHub Pages

Já está configurado! Qualquer commit na branch `main` atualiza automaticamente:
- https://lexisvirtual.github.io/copilot-free/

## 📁 Estrutura do Projeto

```
copilot-free/
├── index.html          # Interface web principal
├── style.css           # Estilos da interface
├── app.js              # Lógica do frontend
├── wrangler.toml       # Config do Cloudflare Worker
├── extension/          # Extensão Chrome
│   ├── manifest.json   # Configuração da extensão
│   ├── background.js   # Service worker
│   ├── content.js      # Script injetado
│   ├── sidebar.html    # Interface do painel
│   ├── sidebar.css     # Estilos do painel
│   ├── sidebar.js      # Lógica do painel
│   └── README.md       # Documentação da extensão
└── README.md           # Este arquivo
```

## 💰 Custos

| Serviço | Custo |
|---------|-------|
| GitHub Pages | 🆓 **GRATUITO** (ilimitado para repos públicos) |
| Cloudflare Workers | 🆓 **GRATUITO** (100.000 requests/dia) |
| **TOTAL** | 🆓 **R$ 0,00/mês** |

## ⚙️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Cloudflare Workers (Edge Computing)
- **Hospedagem**: GitHub Pages (CDN global)
- **Extensão**: Chrome Extension Manifest V3

## 🔒 Permissões da Extensão

- `activeTab` - Acessar aba atual
- `tabs` - Gerenciar abas
- `storage` - Salvar configurações
- `scripting` - Executar scripts
- `sidePanel` - Exibir painel lateral
- `<all_urls>` - Funcionar em qualquer site

## 👥 Contribuir

Contribuições são bem-vindas!

1. Fork este repositório
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'Adiciona nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request

## ⚠️ Aviso Legal

- Use apenas em sites que você tem permissão
- Respeite os termos de serviço dos sites
- A ferramenta é para uso pessoal e produtividade
- Não use para spam ou atividades ilícitas

## 📧 Contato

**Criado por**: [lexisvirtual](https://github.com/lexisvirtual)

Dúvidas ou sugestões? Abra uma [issue](https://github.com/lexisvirtual/copilot-free/issues)!

---

⭐ **Se este projeto foi útil, deixe uma estrela!** ⭐
