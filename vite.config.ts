import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import history from 'vite-plugin-history-api-fallback';

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
    alias: {
      process: "process/browser",
      stream: "stream-browserify",
      zlib: "browserify-zlib",
      util: 'util'
    }
  },
  define: {
    'process.env': process.env
  },
plugins: [
    react(),
    history(),
  ]
})
