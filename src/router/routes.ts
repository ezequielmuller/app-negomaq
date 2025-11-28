
const routes = [
  {
    path: '',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: 'home' },
      { path: 'home', name: 'home', component: () => import('pages/IndexPage.vue') },
      // ==== PRODUTOS ==== //
      { path: 'home-facas-page', name: 'home-facas-page', component: () => import('src/pages/Produtos/FacasPage.vue') },
      { path: 'home-estojo-page', name: 'home-estojo-page', component: () => import('src/pages/Produtos/EstojoPage.vue') },
      { path: 'home-avental-page', name: 'home-avental-page', component: () => import('src/pages/Produtos/AventalPage.vue') },
      { path: 'home-artigo-churrasco-page', name: 'home-artigo-churrasco-page', component: () => import('src/pages/Produtos/ArtigoChurrascoPage.vue') },
      // ==== FINALIZAR VENDA ==== //
      { path: 'home-finalizar-venda', name: 'home-finalizar-venda', component: () => import('pages/FinalizarCompraPage.vue') },
      { path: 'pagamento/sucesso', name: 'pagamento-sucesso', component: () => import('pages/UserPage.vue') },
      { path: 'pagamento/falha', name: 'pagamento-falha', component: () => import('pages/UserPage.vue') },
      { path: 'pagamento/pendente', name: 'pagamento-pendente', component: () => import('pages/UserPage.vue') },
      // ==== USUARIO ==== //
      { path: 'home-user-page', name: 'home-user-page', component: () => import('pages/UserPage.vue'), },
      { path: 'home-recuperar-senha', name: 'home-recuperar-senha', component: () => import('src/pages/RecuperarSenhaPage.vue') },
    ],
  },
  {
    path: '',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: 'login', name: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'cadastro', name: 'cadastro', component: () => import('pages/CadastroPage.vue') },
    ],
  },
  { path: '/:catchAll(.*)*', component: () => import('pages/ErrorNotFound.vue') },
];
export default routes;
