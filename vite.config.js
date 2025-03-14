import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: 'window',  // global을 window로 정의
  },
  plugins: [react()],
  base: "/",
  server: {
    host : "0.0.0.0",
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
      },
      "/backApi" : {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backApi/, ""),
      }
    },
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
