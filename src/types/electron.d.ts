export interface ElectronAPI {
  sendLog: (params: { message: string; level: string; category: string; timestamp: Date, object?: object}) => void;
  onLogUpdate: (callback: (data) => void) => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
