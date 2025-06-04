import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,         // equivalent to 0.0.0.0, allows access from any IP
        port: 5173,         // optional: you can change the port if needed
        strictPort: true,   // optional: fail if the port is already in use
    },
})
