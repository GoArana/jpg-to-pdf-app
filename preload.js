const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  convertToPdf: (folderPath) => ipcRenderer.invoke('convert-images-to-pdf', folderPath)
});
