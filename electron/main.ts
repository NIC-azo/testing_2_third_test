import { app, BrowserWindow, shell } from 'electron';
import { join } from 'path';
import { spawn, ChildProcess } from 'child_process';

const isDev = process.env.NODE_ENV === 'development';
let backendProcess: ChildProcess | null = null;

//Iniciar servidor backend
function startBackend() {
    if (isDev) {
        console.log('Iniciando servidor backend...')
        backendProcess = spawn('npm', ['run', 'dev'], {
            cwd: join(__dirname, '../back-end'),
            stdio: 'inherit',
            shell: true
        })
    }
}

//detener servidor backend
function stopBackend() {
    if (backendProcess) {
        backendProcess.kill()
        backendProcess = null
    }
}

function createWindow(): void {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: true,
            preload: join(__dirname, 'preload.js'),
        },
    })

    //cargar aplicacion
    if (isDev) {
        const rendererPort = process.env.RENDERER_PORT || 5173
        mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadFile(join(__dirname, '../front-end/index.html'))
    }

    //abrir enlaces externos en el navegador
    mainWindow.webContents.setWindowOpenHandler(({url}) => {
        shell.openExternal(url)
        return {action: 'deny'}
    })
}

//Event listeners
app.whenReady().then(() => {
    startBackend()

    //Esperar a que el backend esté listo antes de crear la ventana
    setTimeout(() => {
        createWindow()
    }, 3000)

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    stopBackend()
    if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
    stopBackend()
})