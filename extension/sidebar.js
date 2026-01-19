const output = document.getElementById("output");
const commandInput = document.getElementById("commandInput");
const executeBtn = document.getElementById("executeBtn");
const refreshBtn = document.getElementById("refreshBtn");

// Exemplo de hooks (mantém compatibilidade)
executeBtn.addEventListener("click", () => {
  const cmd = commandInput.value.trim();
  if (!cmd) return;

  output.textContent += "\n\n▶ " + cmd;
  commandInput.value = "";
});

refreshBtn.addEventListener("click", () => {
  output.textContent += "\n\n⟳ Contexto atualizado...";
});
