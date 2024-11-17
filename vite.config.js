import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
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
        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes) => {
            let setCookieHeaders = proxyRes.headers["set-cookie"];
            console.log(setCookieHeaders);
            if (setCookieHeaders) {
              proxyRes.headers["hello"] = JSON.stringify(setCookieHeaders);
            }
          });
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
      },
      "/ok": {
        target: "https://api.live.bilibili.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ok/, ""),
        headers: {
          Origin: "https://www.bilibili.com",
          Referer: "https://www.bilibili.com/",
        },
        secure: true,
      },
    },
  },
});
