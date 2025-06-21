const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('pages/LoginPage.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: 'facas',
        name: 'facas',
        component: () => import('pages/FacasPage.vue'),
      },
      {
        path: 'estojos-facas',
        name: 'estojos-facas',
        component: () => import('pages/EstojosFacasPage.vue'),
      },
      {
        path: 'aventais',
        name: 'aventais',
        component: () => import('pages/AventaisPage.vue'),
      },
      {
        path: 'artigos-churrasco',
        name: 'artigos-churrasco',
        component: () => import('pages/ArtigosChurrascoPage.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
