const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const sizeOf = require('image-size');

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  return result.filePaths[0];
});

ipcMain.handle('convert-images-to-pdf', async (_, folderPath) => {
  const files = fs.readdirSync(folderPath)
    .filter(f => f.match(/\.(jpg|jpeg|png)$/i));

  const generatedFiles = [];

  for (const file of files) {
    const imagePath = path.join(folderPath, file);
    const imageBytes = fs.readFileSync(imagePath);
    const dimensions = sizeOf(imagePath);

    const pdfDoc = await PDFDocument.create();

    let img;
    if (file.endsWith('.png')) {
      img = await pdfDoc.embedPng(imageBytes);
    } else {
      img = await pdfDoc.embedJpg(imageBytes);
    }

    const page = pdfDoc.addPage([dimensions.width, dimensions.height]);
    page.drawImage(img, {
      x: 0,
      y: 0,
      width: dimensions.width,
      height: dimensions.height,
    });

    const pdfBytes = await pdfDoc.save();
    const outputFilename = path.basename(file, path.extname(file)) + '.pdf';
    const outputPath = path.join(folderPath, outputFilename);

    fs.writeFileSync(outputPath, pdfBytes);
    generatedFiles.push(outputPath);
  }

  return generatedFiles;
});
