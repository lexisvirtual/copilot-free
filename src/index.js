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

    try {
      const body = await request.json();
      const { message, context } = body;

      if (!message) {
        return new Response(JSON.stringify({ error: 'Message required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const systemPrompt = `Você é um agente de automação web inteligente, similar ao Comet.

Capacidades:
- Analisar páginas web
- Planejar ações complexas  
- Preencher formulários
- Navegar entre páginas
- Criar landing pages e HTML
- Publicar anúncios (Facebook, Google)
- Automatizar tarefas

Contexto da página:
${context ? JSON.stringify(context, null, 2) : 'Nenhum'}

Responda de forma clara. Para ações, retorne JSON:
{
  "reply": "sua resposta",
  "actions": [
    {"type": "click", "selector": "#btn"},
    {"type": "fill", "selector": "#input", "value": "texto"},
    {"type": "navigate", "url": "https://..."},
    {"type": "screenshot"},
    {"type": "execute", "code": "js..."}
  ]
}`;

      const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 1024,
        temperature: 0.7
      });

      const reply = aiResponse.response || 'Erro ao processar';

      let responseData;
      try {
        responseData = JSON.parse(reply);
      } catch (e) {
        responseData = { reply, actions: [] };
      }

      return new Response(JSON.stringify(responseData), {
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
};
