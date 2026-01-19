const consoleBox = document.getElementById("console");
const input = document.getElementById("commandInput");

document.getElementById("executeBtn").onclick = () => {
  if (!input.value.trim()) return;
  consoleBox.innerHTML += `<br><br><strong>▶</strong> ${input.value}`;
  input.value = "";
  consoleBox.scrollTop = consoleBox.scrollHeight;
};

document.getElementById("refreshBtn").onclick = () => {
  consoleBox.innerHTML += "<br><br>⟳ Contexto atualizado...";
  consoleBox.scrollTop = consoleBox.scrollHeight;
};
