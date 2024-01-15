const koffi = require("koffi");
const WTS = require("./wts");
const KTS = require("./kts");

module.exports = () => {
  const kernel32Dll = koffi.load("kernel32.dll");
  const kernel32 = {
    OpenProcess: kernel32Dll.func(KTS.STDCALL, "OpenProcess", KTS.HANDLE, [
      KTS.DWORD,
      KTS.BOOL,
      KTS.DWORD,
    ]),
    CloseHandle: kernel32Dll.func(KTS.STDCALL, "CloseHandle", KTS.BOOL, [
      KTS.HANDLE,
    ]),
  };

  return {
    openProcessHandle: (processId) => {
      const dwDesiredAccess =
        WTS.PROCESS_QUERY_INFORMATION | WTS.PROCESS_VM_READ;
      const bInheritHandle = false;
      const dwProcessId = processId;
      return kernel32.OpenProcess(dwDesiredAccess, bInheritHandle, dwProcessId);
    },

    closeProcessHandle: (processHandle) => {
      const hObject = processHandle;
      return kernel32.CloseHandle(hObject);
    },
  };
};
