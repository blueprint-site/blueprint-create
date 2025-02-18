export interface ElectronAPI {
    sendLog: ({message: string, level: number, category: string, timestamp: Date}) => void;
    onLogUpdate: (callback: (function(*): void) | *) => void;
}

declare global {
    interface Window {
        electron: ElectronAPI;
    }
}
