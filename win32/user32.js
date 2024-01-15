const koffi = require("koffi");
const WTS = require("./wts");
const KTS = require("./kts");

module.exports = () => {
  const user32Dll = koffi.load("user32.dll");
  const user32 = {
    GetWindowThreadProcessId: user32Dll.func(
      KTS.STDCALL,
      "GetWindowThreadProcessId",
      KTS.DWORD,
      [KTS.HWND, KTS.LPDWORD]
    ),
    GetWindowTextA: user32Dll.func(KTS.STDCALL, "GetWindowTextA", KTS.INT, [
      KTS.HWND,
      KTS.LPSTR,
      KTS.INT,
    ]),
    FindWindowExA: user32Dll.func(KTS.STDCALL, "FindWindowExA", KTS.HWND, [
      KTS.HWND,
      KTS.HWND,
      KTS.LPCSTR,
      KTS.LPCSTR,
    ]),
    IsWindow: user32Dll.func(KTS.STDCALL, "IsWindow", KTS.BOOL, [KTS.HWND]),
    IsWindowVisible: user32Dll.func(KTS.STDCALL, "IsWindowVisible", KTS.BOOL, [
      KTS.HWND,
    ]),
    GetWindow: user32Dll.func(KTS.STDCALL, "GetWindow", KTS.HWND, [
      KTS.HWND,
      KTS.UINT,
    ]),
    GetWindowLongA: user32Dll.func(KTS.STDCALL, "GetWindowLongA", KTS.LONG, [
      KTS.HWND,
      KTS.INT,
    ]),
    GetParent: user32Dll.func(KTS.STDCALL, "GetParent", KTS.HWND, [KTS.HWND]),
    FindWindowA: user32Dll.func(KTS.STDCALL, "FindWindowA", KTS.HWND, [
      KTS.LPCSTR,
      KTS.LPCSTR,
    ]),
    ShowWindow: user32Dll.func(KTS.STDCALL, "ShowWindow", KTS.BOOL, [
      KTS.HWND,
      KTS.INT,
    ]),
    SetWindowPos: user32Dll.func(KTS.STDCALL, "SetWindowPos", KTS.BOOL, [
      KTS.HWND,
      KTS.HWND,
      KTS.INT,
      KTS.INT,
      KTS.INT,
      KTS.INT,
      KTS.UINT,
    ]),
  };

  return {
    getProcessId: (windowHandle) => {
      const hWnd = windowHandle;
      const lpdwProcessId = Buffer.alloc(koffi.sizeof(KTS.DWORD));
      const ret = user32.GetWindowThreadProcessId(hWnd, lpdwProcessId);
      if (!ret) throw new Error("getProcessId()");
      const pid = koffi.decode(lpdwProcessId, KTS.DWORD);
      return pid;
    },

    getTitleByWindowHandle: (windowHandle) => {
      const hWnd = windowHandle;
      const lpString = Buffer.alloc(WTS.MAX_PATH);
      const length = user32.GetWindowTextA(hWnd, lpString, lpString.length);
      if (length === null) throw new Error("getTitleByWindowHandle()");
      const title = koffi.decode(lpString, KTS.CHAR, length);
      return title;
    },

    findFirstWindowHandle(title) {
      const hWndParent = WTS.NULL_VALUE;
      const hWndChildAfter = WTS.NULL_VALUE;
      const lpszClass = WTS.NULL_PTR;
      const lpszWindow = title;
      return user32.FindWindowExA(
        hWndParent,
        hWndChildAfter,
        lpszClass,
        lpszWindow
      );
    },

    findChildAfterWindowHandle(windowHandle) {
      const hWndParent = WTS.NULL_VALUE;
      const hWndChildAfter = windowHandle;
      const lpszClass = WTS.NULL_PTR;
      const lpszWindow = WTS.NULL_PTR;
      return user32.FindWindowExA(
        hWndParent,
        hWndChildAfter,
        lpszClass,
        lpszWindow
      );
    },

    isWindow: (windowHandle) => {
      const hWnd = windowHandle;
      return user32.IsWindow(hWnd);
    },

    isWindowVisible: (windowHandle) => {
      const hWnd = windowHandle;
      return user32.IsWindowVisible(hWnd);
    },

    getWindowHandleBelowZOrder: (windowHandle) => {
      const hWnd = windowHandle;
      const uCmd = WTS.GW_HWNDNEXT;
      return user32.GetWindow(hWnd, uCmd);
    },

    isMinimized: (windowHandle) => {
      const hWnd = windowHandle;
      const nIndex = WTS.GWL_STYLE;
      const style = user32.GetWindowLongA(hWnd, nIndex);
      if (style === 0) return false;
      return (style & WTS.WS_MINIMIZE) > 0;
    },

    restoreWindow: (windowHandle) => {
      const hWnd = windowHandle;
      const nCmdShow = WTS.SW_RESTORE;
      const ret = user32.ShowWindow(hWnd, nCmdShow);
      // https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-showwindow
      // ShowWindow(): if previously hidden, value is zero;
      return !ret;
    },

    getParentWindowHandle: (windowHandle) => {
      const hWnd = windowHandle;
      return user32.GetParent(hWnd);
    },

    getRootWindowHandle: () => {
      return user32.FindWindowA(null, null);
    },

    setTop: (windowHandle) => {
      const hWnd = windowHandle;
      // WTS.HWND_TOP : It's not always to be `TOP`.
      const hWndInsertAfter1 = WTS.HWND_TOPMOST;
      const hWndInsertAfter2 = WTS.HWND_NOTOPMOST;
      const x = 0;
      const y = 0;
      const cx = 0;
      const cy = 0;
      const uFlags = WTS.SWP_NOMOVE | WTS.SWP_NOSIZE;
      const param = [x, y, cx, cy, uFlags];
      const res1 = user32.SetWindowPos(hWnd, hWndInsertAfter1, ...param);
      const res2 = user32.SetWindowPos(hWnd, hWndInsertAfter2, ...param);
      return res1 && res2;
    },
  };
};
