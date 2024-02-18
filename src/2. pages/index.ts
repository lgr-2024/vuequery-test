import Routing from "./index.vue";

export const routes = [{ path: "/", component: () => import("./post-lists") }];

export { Routing };
