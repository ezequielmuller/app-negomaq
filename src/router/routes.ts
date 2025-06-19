const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "facas",
        name: "facas",
        component: () => import("pages/FacasPage.vue"),
      },
    ],
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
