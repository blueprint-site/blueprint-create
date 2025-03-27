/* eslint-disable @typescript-eslint/no-require-imports */
/* global require */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  sendLog: (log) => ipcRenderer.send('log-message', log),
  onLogUpdate: (callback) => ipcRenderer.on('update-logs', (_, data) => callback(data)),
});
