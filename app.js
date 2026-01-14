const API_URL = "https://copilot-assistant.lexis-english-account.workers.dev";

const form = document.getElementById("form");
const input = document.getElementById("prompt");
const output = document.getElementById("response");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userPrompt = input.value.trim();
  if (!userPrompt) return;

  output.textContent = "Pensando...";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: userPrompt
      })
    });

    const data = await res.json();
    output.textContent = data.response || JSON.stringify(data, null, 2);
  } catch (err) {
    output.textContent = "Erro ao conectar com o backend.";
  }
});
