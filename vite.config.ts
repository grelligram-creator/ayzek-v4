import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import {defineConfig} from 'vite';

const projectDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(projectDirectory, '.'),
      },
    },
    server: {
      // The temporary phone-preview tunnel uses a random *.loca.lt hostname.
      // Restrict this exception to that provider rather than allowing all hosts.
      allowedHosts: ['.loca.lt'],
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('/firebase/')) return 'firebase';
            if (id.includes('/react/') || id.includes('/react-dom/')) return 'react';
            if (id.includes('/motion/')) return 'motion';
            if (id.includes('/lucide-react/')) return 'icons';
            return 'vendor';
          },
        },
      },
    },
  };
});
