import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  base: "/games-opinion-V2/", // Nombre del repositorio de GitHub
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[hash].[ext]",
        chunkFileNames: "assets/[name].[hash].js",
        entryFileNames: "assets/[name].[hash].js",
      },
    },
  },
});
