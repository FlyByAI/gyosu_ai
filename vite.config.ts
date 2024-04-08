import react from '@vitejs/plugin-react';
import { terser } from 'rollup-plugin-terser';
import { defineConfig } from 'vite';

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
    terser({
      keep_fnames: true,
      mangle: {
        keep_fnames: true,
      },
    }),
  ]

})
