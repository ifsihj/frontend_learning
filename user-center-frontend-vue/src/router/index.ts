import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/projectManagement",
    name: "projectManagement",
    component: () =>
      import(
        /* webpackChunkName: "projectManagement" */ "../views/projectManagement.vue"
      ),
  },
  {
    path: "/discussionBoard",
    name: "discussionBoard",
    component: () =>
      import(
        /* webpackChunkName: "discussionBoard" */ "../views/discussionBoard.vue"
      ),
  },
  {
    path: "/terminal",
    name: "terminal",
    component: () =>
      import(/* webpackChunkName: "terminal" */ "../components/Terminal.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
