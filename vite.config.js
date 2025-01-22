import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    port: 3000,
    proxy: {
      "/naver" : {
        target: "https://nid.naver.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/naver/, ""),
      },
      "/userInfo" : {
        target: "https://openapi.naver.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/userInfo/, ""),
      }
      "/backApi" : {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backApi/, ""),
      }
    }
  },
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  test: {
    globals: true,
    include: ["src/**/*.test.js", "src/**/*.test.jsx"],
    environment: "jsdom",
    setupFiles: "./vitest.setup.js",
  },
  build: {
    chunkSizeWarningLimit: 100000000,
  },
});
