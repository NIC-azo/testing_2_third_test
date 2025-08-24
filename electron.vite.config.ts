import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()],
        build: {
            rollupOptions: {
                input: resolve(__dirname, 'electron/main.ts')
            }
        }
    },
    preload: {
        plugins: [externalizeDepsPlugin()],
        build: {
            rollupOptions: {
                input: resolve(__dirname, 'electron/preload.ts')
            }
        }
    },
    renderer: {
        root: resolve(__dirname, 'front-end'),
        plugins: [react(), tailwindcss()],
        build: {
            rollupOptions: {
                input: resolve(__dirname, 'front-end/index.html')
            }
        }
    }
})