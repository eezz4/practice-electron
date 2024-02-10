const koffi = require("koffi");
const WTS = require("./wts");
const KTS = require("./kts");

module.exports = () => {
  const psapiDll = koffi.load("psapi.dll");
  const psapi = {
    GetModuleFileNameExA: psapiDll.func(
      KTS.STDCALL,
      "GetModuleFileNameExA",
      KTS.DWORD,
      [KTS.HANDLE, KTS.HMODULE, KTS.LPSTR, KTS.DWORD]
    ),
  };

  return {
    getModuleFileNameEx: (processHandle) => {
      const hProcess = processHandle;
      const hModule = WTS.NULL_VALUE;
      const lpFilenameBuf = Buffer.alloc(WTS.MAX_PATH);
      const nSize = WTS.MAX_PATH;
      const ret = psapi.GetModuleFileNameExA(
        hProcess,
        hModule,
        lpFilenameBuf,
        nSize
      );

      const fileNameEx = koffi.decode(lpFilenameBuf, KTS.CHAR, ret);
      return fileNameEx;
    },
  };
};
