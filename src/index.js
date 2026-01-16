// Copilot Free - Worker com Cloudflare Workers AI
// Agente autônomo gratuito tipo Comet

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Only POST allowed', { 
        status: 405, 
        headers: corsHeaders 
      });
    }

    const url = new URL(request.url);
    
    // Rota /agent - para o agente tipo Comet
    if (url.pathname === '/agent') {
      return handleAgent(request, env, corsHeaders);
    }
    
    // Rota padrão - chat normal
    return handleChat(request, env, corsHeaders);
  }
};

// Handler para o agente tipo Comet
async function handleAgent(request, env, corsHeaders) {
  try {
    const body = await request.json();
    const { pageContext, userCommand } = body;

    if (!userCommand) {
      return new Response(JSON.stringify({ error: 'userCommand required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Prompt otimizado para retornar sempre JSON estruturado
    const systemPrompt = `Você é um agente web autônomo tipo Comet. Você SEMPRE responde em JSON válido.

CONTEXTO DA PÁGINA:
URL: ${pageContext?.url || 'N/A'}
Título: ${pageContext?.title || 'N/A'}
Texto selecionado: ${pageContext?.selectedText || 'N/A'}
HTML visível: ${pageContext?.visibleHTML?.substring(0, 500) || 'N/A'}

INSTRUÇÕES:
1. Analise o comando do usuário e o contexto da página
2. Planeje as ações necessárias
3. SEMPRE responda APENAS com JSON válido no formato abaixo
4. Não adicione texto fora do JSON

FORMATO DE RESPOSTA (copie exatamente):
{
  "thinking": "seu raciocínio aqui",
  "reply": "sua resposta ao usuário",
  "steps": [
    {"action": "click", "selector": "#button-id"},
    {"action": "fill", "selector": "input[name='email']", "value": "texto"},
    {"action": "scroll", "direction": "down", "amount": 500},
    {"action": "navigate", "url": "https://exemplo.com"},
    {"action": "screenshot"},
    {"action": "wait", "ms": 1000}
  ]
}

AÇÕES DISPONÍVEIS:
- click: clica em elemento (precisa de selector)
- fill: preenche input/textarea (precisa de selector e value)
- scroll: rola a página (direction: "up"/"down", amount em pixels)
- navigate: navega para URL (precisa de url)
- screenshot: tira print da tela
- wait: aguarda tempo em ms

IMPORTANTE: Retorne APENAS o JSON, sem markdown, sem explicações extras.`;

    const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userCommand }
      ],
      max_tokens: 2048,
      temperature: 0.3 // Menor temperatura para respostas mais consistentes
    });

    const reply = aiResponse.response || '{"error": "No response"}';
    
    // Tenta extrair JSON da resposta
    let responseData;
    try {
      // Remove markdown se existir
      const cleanReply = reply.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      responseData = JSON.parse(cleanReply);
    } catch (e) {
      // Se falhar, retorna estrutura básica
      responseData = { 
        thinking: "Erro ao processar resposta",
        reply: reply,
        steps: []
      };
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message,
      reply: 'Desculpe, houve um erro ao processar sua solicitação.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Handler para chat normal (mantém compatibilidade)
async function handleChat(request, env, corsHeaders) {
  try {
    const body = await request.json();
    const { message, context } = body;

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const systemPrompt = `Você é um assistente de marketing e criação de HTML.
Contexto: ${context ? JSON.stringify(context) : 'Nenhum'}
Ajude o usuário com copywriting, landing pages e estratégias de marketing.`;

    const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 1024,
      temperature: 0.7
    });

    const reply = aiResponse.response || 'Erro ao processar';

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message,
      reply: 'Desculpe, houve um erro.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
