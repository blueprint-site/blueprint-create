const logMessage = (message: string, level: number = 0, category: string = 'default') =>  {
    const date = new Date();
    const log : { message: string; level: string; category: string; timestamp: Date } = {
        message : message,
        level: level === 1 ? 'warning' : level === 2 ? 'error' : 'info', // Map level to string
        timestamp: date,
        category: category,
    };

    // Vérifie si l'application est dans un environnement Electron
    const isElectron = window && window.electron && typeof window.electron.sendLog === 'function';

    if (isElectron) {
        window.electron.sendLog({
            message : message,
            level: level === 1 ? 'warning' : level === 2 ? 'error' : 'info', // Map level to string
            timestamp: date,
            category: category,
        });
    } else {
        // Log dans la console si pas dans Electron
        console[level === 1 ? 'warn' : level === 2 ? 'error' : 'log'](log);
    }
}
export default logMessage