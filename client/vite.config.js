// client/vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // You need this for React
import tailwindcss from '@tailwindcss/vite'; // The new Tailwind plugin

export default defineConfig({
  plugins: [
    react(),          // Keep the React plugin
    tailwindcss(),      // Add the Tailwind plugin
  ],
  // Keep your server proxy so the frontend can talk to the backend
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    }
  }
});