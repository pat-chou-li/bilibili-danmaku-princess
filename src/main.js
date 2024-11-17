import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import { createRouter, createWebHistory } from "vue-router";
import live from "./pages/live.vue";
import home from "./pages/home.vue";

const routes = [
  { path: "/", component: home },
  { path: "/live", component: live },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).mount("#app");
