const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const registerPrint = require("./print/print");

async function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true, // node api 사용
      contextIsolation: false, // 격리 환경 (웹뷰로만 사용 여부) false
    },
  });

  mainWindow.webContents.openDevTools();
  await mainWindow.loadFile("src/renderer/index.html");
  return mainWindow;
}

app.whenReady().then(async () => {
  const mainWindow = await createWindow();
  registerPrint(mainWindow);
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
