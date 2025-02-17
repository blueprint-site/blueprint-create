import {app, BrowserWindow, ipcMain} from "electron";

import path from "path";

let mainWindow, logWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // eslint-disable-next-line no-undef
            preload: path.join(__dirname, "preload.cjs"), // Utilisation du preload
        },
    });
    mainWindow.loadURL("http://localhost:5173");

    logWindow = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            // eslint-disable-next-line no-undef
            preload: path.join(__dirname, "preload.cjs"), // Même preload pour la fenêtre de logs
        },
    });
    logWindow.loadFile("logs.html");
});

// Gérer les logs
ipcMain.on("log-message", (_, log) => {
    if (logWindow) {
        logWindow.webContents.send("update-logs", log);
    }
});