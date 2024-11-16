import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/passport": {
        target: "https://passport.bilibili.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/passport/, ""),
        headers: {
          Origin: "https://www.bilibili.com",
          Referer: "https://www.bilibili.com/",
        },
        secure: true,
        cookieDomainRewrite: {
          "*": "",
        },
      },
      "/api": {
        target: "https://api.bilibili.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        headers: {
          Origin: "https://www.bilibili.com",
          Referer: "https://www.bilibili.com/",
        },
        secure: true,
        cookieDomainRewrite: {
          "*": "",
        },
        cookiePathRewrite: {
          "*": "/",
        },
      },
    },
  },
});
