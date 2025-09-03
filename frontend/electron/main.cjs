const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow, logWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });
  mainWindow.loadURL('http://localhost:5173');

  logWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });
  logWindow.loadFile('logs.html');
});

// Gérer les logs
ipcMain.on('log-message', (_, log) => {
  if (logWindow) {
    logWindow.webContents.send('update-logs', log);
  }
});
