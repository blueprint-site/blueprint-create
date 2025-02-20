// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const { app, BrowserWindow, ipcMain } = require("electron");
// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const path = require("path");


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