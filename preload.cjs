// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    sendLog: (log) => ipcRenderer.send("log-message", log),
    onLogUpdate: (callback) => ipcRenderer.on("update-logs", (_, data) => callback(data)),
});
