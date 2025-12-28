import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    nodePolyfills({
      include: ['process', 'buffer', 'util', 'stream'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    })
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5001",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/socket.io": {
        target: "http://127.0.0.1:5001",
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
