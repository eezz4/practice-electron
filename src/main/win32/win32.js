const user32 = require("./user32")();
const kernel32 = require("./kernel32")();
const psapi = require("./psapi")();

module.exports = function testWin32() {
  const hWnd = user32.findFirstWindowHandle("target_title");
  console.log("hWnd::: ", hWnd);
  if (hWnd === null) return;
  console.log("isWindowVisible::: ", user32.isWindow(hWnd));
  const windowTitle = user32.getTitleByWindowHandle(hWnd);
  console.log("title::: ", windowTitle);
  const pid = user32.getProcessId(hWnd);
  console.log("pid::: ", pid);
  const focus = focusWindow(hWnd);
  console.log("focus::: ", focus);
  const processHandle = kernel32.openProcessHandle(pid);
  if (processHandle === null) return;
  console.log("processHandle::: ", processHandle);
  const filenameEx = psapi.getModuleFileNameEx(processHandle);
  console.log("filenameEx::: ", filenameEx);
};

function focusWindow(windowHandle) {
  if (user32.isMinimized(windowHandle)) {
    user32.restoreWindow(windowHandle);
  }
  return user32.setTop(windowHandle);
}
