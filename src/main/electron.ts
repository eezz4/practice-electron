import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { is } from "typia";
import { ComplexType } from "../globals/typiaType";
import { typiaExp } from "./typiaExp/typiaExp";

export const isDev = process.env.NODE_ENV === "development";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (isDev) mainWindow.loadURL("http://localhost:3000");
  else mainWindow.loadFile(path.join("build", "index.html"));
}

app.whenReady().then(() => {
  createWindow();
  typiaExp();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("ipcChecker", () => {
  return 1;
});

ipcMain.handle("TypiaExp1", (_, ...args: any[]) => {
  return is<number>(args[0]);
});

ipcMain.handle("TypiaExp2", (_, ...args: any[]) => {
  return is<ComplexType>(args[0]);
});
