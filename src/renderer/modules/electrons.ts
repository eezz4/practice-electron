export const getIpcRenderer = () => {
  const electron =  window.require("electron"); 
  return electron.ipcRenderer
}