import { contextBridge } from "electron";
import { platform, version } from "os";

//API segura expuesta al renderer
const electronAPI = {
    platform: process.platform,
    version: process.versions,
    //si quiero puedo agregar mas apis
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

//declaración global para typescript
declare global {
    interface Window {
        electronAPI: typeof electronAPI
    }
}