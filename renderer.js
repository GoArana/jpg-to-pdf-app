const selectBtn = document.getElementById('select');
const convertBtn = document.getElementById('convert');
const folderPathP = document.getElementById('folderPath');
const outputP = document.getElementById('output');

let selectedPath = '';

selectBtn.addEventListener('click', async () => {
  selectedPath = await window.electronAPI.selectFolder();
  folderPathP.textContent = selectedPath || 'No seleccionada';
});

convertBtn.addEventListener('click', async () => {
  if (!selectedPath) return alert('Seleccioná una carpeta primero.');
  const outputPaths = await window.electronAPI.convertToPdf(selectedPath);
  outputP.innerHTML = "PDFs generados:<br>" + outputPaths.map(p => `✔ ${p}`).join("<br>");
});

