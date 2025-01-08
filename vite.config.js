import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": "/src", // Atajo para rutas relativas
    },
  },
  server: {
    port: 5173, // Cambia el puerto si lo necesitas
  },
});
