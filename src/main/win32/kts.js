module.exports = {
  STDCALL: "__stdcall",

  // https://learn.microsoft.com/ko-kr/windows/win32/winprog/windows-data-types
  LPSTR: "uint8 *", // KOFFI
  LPCSTR: "string", // KOFFI

  CHAR: "char",
  DWORD: "ulong",
  BOOL: "bool",
  INT: "int",
  UINT: "uint",
  LONG: "long",
  LONG_PTR: "int64", // 64bit defined,
  ULONG_PTR: "uint64", // 64bit defined,
  UINT_PTR: "uint64", // 64bit defined,
  DWORD_PTR: "uint64",

  PVOID: "void *",
  HANDLE: "void *",
  HWND: "void *",
  HINSTANCE: "void *",
  HMODULE: "void *",
  LPDWORD: "ulong *",
  PDWORD_PTR: "uint64 *",

  LRESULT: "int64",
  WPARAM: "uint64",
  LPARAM: "int64",
};
