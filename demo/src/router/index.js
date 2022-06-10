import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

//  const componentPages = require.context('@/views', false)
const componentPages = require.context("@/views", true, /^\.\/\w+$/);
export const routes = componentPages.keys().map((key) => {
  const path = key.replace("./", "");
  return {
    path: `/${path}`,
    component: loadView(path),
  };
});

function loadView(path) {
  return () => import(`@/views/${path}`);
}

const router = new Router({
  mode: "history",
  routes,
});

export default router;
