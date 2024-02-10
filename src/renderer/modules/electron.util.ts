// path
export const path = window.require("path");

// electron
const electron = window.require("electron");
export const invoke = (channel: string, ...args: any[]) =>
  electron.ipcRenderer.invoke(channel, ...args);
