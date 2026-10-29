import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// La librería se instala con "file:..": es un enlace a la raíz del repo, fuera de esta carpeta.
// dedupe hace que sus .vue usen el mismo Vue que el sitio; fs.allow deja servir sus fuentes y CSS.
export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: { dedupe: ['vue'] },
  server: { fs: { allow: ['..'] } },
});
