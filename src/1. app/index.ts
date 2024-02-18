import { createApp } from "vue";
import "./style.css";
import App from "./index.vue";
import { VueQueryPlugin } from "@tanstack/vue-query";

export const app = createApp(App).use(VueQueryPlugin);