// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const path = require("node:path");
const user32 = require("./win32/user32")();
const kernel32 = require("./win32/kernel32")();
const psapi = require("./win32/psapi")();

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html").then(() => {
    // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const hWnd = user32.findFirstWindowHandle("Hello World!");
    console.log("hWnd::: ", hWnd);
    if (hWnd === null) return;
    console.log("isWindowVisible::: ", user32.isWindow(hWnd));
    const title1 = user32.getTitleByWindowHandle(hWnd);
    console.log("title1::: ", title1);
    const pid = user32.getProcessId(hWnd);
    console.log("pid::: ", pid);
    const focus = focusWindow(hWnd);
    console.log("focus::: ", focus);
    const processHandle = kernel32.openProcessHandle(pid);
    if (processHandle === null) return;
    console.log("processHandle::: ", processHandle);
    const filenameEx = psapi.getModuleFileNameEx(processHandle);
    console.log("filenameEx::: ", filenameEx);

    // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function focusWindow(windowHandle) {
      if (user32.isMinimized(windowHandle)) {
        user32.restoreWindow(windowHandle);
      }
      return user32.setTop(windowHandle);
    }
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
