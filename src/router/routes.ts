const routes = [
  {
    path: '',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // redireciona a raiz para /home
      { path: '', redirect: 'home' },

      // ==== PÁGINAS ==== //
      { path: 'home', name: 'home', component: () => import('pages/IndexPage.vue') },
      {
        path: 'home-user-page',
        name: 'home-user-page',
        component: () => import('pages/UserPage.vue'),
      },

      // ==== PRODUTOS ==== //
      {
        path: 'home-facas-page',
        name: 'home-facas-page',
        component: () => import('pages/FacasPage.vue'),
      },
      {
        path: 'home-estojo-page',
        name: 'home-estojo-page',
        component: () => import('pages/EstojoPage.vue'),
      },
      {
        path: 'home-avental-page',
        name: 'home-avental-page',
        component: () => import('pages/AventalPage.vue'),
      },
      {
        path: 'home-artigo-churrasco-page',
        name: 'home-artigo-churrasco-page',
        component: () => import('pages/ArtigoChurrascoPage.vue'),
      },
    ],
  },

  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', name: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'cadastro', name: 'cadastro', component: () => import('pages/CadastroPage.vue') },
    ],
  },

  { path: '/:catchAll(.*)*', component: () => import('pages/ErrorNotFound.vue') },
];

export default routes;
