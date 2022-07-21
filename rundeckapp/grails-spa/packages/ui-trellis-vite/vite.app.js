import path from "path";
const pathSrc = path.resolve(__dirname, "./src");

import { defineConfig } from "vite";
import { createVuePlugin as Vue2 } from 'vite-plugin-vue2'


const config = defineConfig({
  resolve: {
    alias: {
      "@": `${path.resolve(__dirname, "src")}`,
    },
    dedupe: ['vue-demi'],
  },


  plugins: [
    Vue2(),
  ],
  build: {
    outDir: '../../../grails-app/assets/provided/static/ui-trellis-vite/',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|svg|ico/i.test(extType)) {
            extType = 'img';
          }
          return `${extType}/[name][extname]`;
          //return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: '[name].js',
        entryFileNames: '[name].js',
      },
    },
  },
  server: {
    port: 8080,
  },
});

export default config;