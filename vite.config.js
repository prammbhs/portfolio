import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from '@tailwindcss/vite';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(_dirname, "./src"),
    },
  },
  server: {
    hmr: {
      protocol: "ws",
      host: "localhost",
      clientPort: 5173,
    },
  },
})
