const { ipcMain } = require("electron");
const pdfToPrinter = require("pdf-to-printer");
const fsPromises = require("fs/promises");
const path = require("node:path");

module.exports = function registerPrint(mainWindow) {
  ipcMain.handle("printChannel", async (event, args) => {
    // Test reproduction path: It works by injecting parameters from the UI.
    const pdfData = await mainWindow.webContents.printToPDF(args);

    const pdfPath = path.join(__dirname, "test.pdf");
    await fsPromises.writeFile(pdfPath, pdfData);

    await pdfToPrinter.print(pdfPath, {
      printDialog: true,
    });
  });
};
