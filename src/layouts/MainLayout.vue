<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-white text-black">
      <q-toolbar class="q-px-lg">

        <q-toolbar-title class="row items-center">
          <span class="text-bold text-h6">NegoMaq</span>
        </q-toolbar-title>

        <div class="row items-center q-gutter-md gt-sm">
          <router-link to="/" class="no-underline text-grey-8" style="color: #666; text-decoration: none;">
            Home
          </router-link>
          <router-link to="/facas-page" class="no-underline text-grey-8" style="color: #666; text-decoration: none;">
            Facas
          </router-link>
          <router-link to="/estojo-page" class="no-underline text-grey-8" style="color: #666; text-decoration: none;">
            Estojos
          </router-link>
          <router-link to="/avental-page" class="no-underline text-grey-8" style="color: #666; text-decoration: none;">
            Aventais
          </router-link>
          <router-link to="/artigo-churrasco-page" class="no-underline text-grey-8"
            style="color: #666; text-decoration: none;">
            Artigos de Churrasco
          </router-link>
        </div>

        <div class="row items-center q-gutter-sm q-ml-md gt-sm">
          <q-btn round dense flat icon="manage_accounts" class="text-grey-8" to="/user-page">
            <q-tooltip>Painel de Usuário</q-tooltip>
          </q-btn>

          <q-btn round dense flat class="text-grey" @click="menuCarrinho = true">
            <q-icon name="shopping_cart" />
            <q-badge v-if="cartCount > 0" color="warning" floating class="text-black shadow-lg flex flex-center"
              style="font-weight:700; font-size:14px; min-width:22px; height:22px; border-radius:12px; box-shadow:0 0 8px rgba(255,193,7,.7);">
              {{ cartCount }}
            </q-badge>
            <q-tooltip>Meu Carrinho</q-tooltip>
          </q-btn>
        </div>

        <q-btn dense flat round icon="menu" class="lt-md" @click="menuMobile = true" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="menuMobile" side="right" bordered class="column justify-between">
      <!-- Lista -->
      <q-list>
        <q-item clickable to="/">
          <q-item-section avatar><q-icon name="home" /></q-item-section>
          <q-item-section>Home</q-item-section>
        </q-item>

        <q-item clickable to="/facas-page">
          <q-item-section avatar><q-icon name="restaurant" /></q-item-section>
          <q-item-section>Facas</q-item-section>
        </q-item>

        <q-item clickable to="/estojo-page">
          <q-item-section avatar><q-icon name="work" /></q-item-section>
          <q-item-section>Estojos</q-item-section>
        </q-item>

        <q-item clickable to="/avental-page">
          <q-item-section avatar><q-icon name="checkroom" /></q-item-section>
          <q-item-section>Aventais</q-item-section>
        </q-item>

        <q-item clickable to="/artigo-churrasco-page">
          <q-item-section avatar><q-icon name="outdoor_grill" /></q-item-section>
          <q-item-section>Artigos de Churrasco</q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable to="/user-page">
          <q-item-section avatar><q-icon name="manage_accounts" /></q-item-section>
          <q-item-section>Painel de Usuário</q-item-section>
        </q-item>

        <q-item clickable @click="menuCarrinho = true">
          <q-item-section avatar><q-icon name="shopping_cart" /></q-item-section>
          <q-item-section>Meu Carrinho</q-item-section>
          <q-item-section side v-if="cartCount > 0">
            <q-badge color="warning" class="text-black">{{ cartCount }}</q-badge>
          </q-item-section>
        </q-item>
      </q-list>

      <!-- Rodapé -->
      <div class="q-pa-md text-center bg-primary text-white text-bold">
        NegoMaq
      </div>
    </q-drawer>


    <q-page-container>
      <router-view :adicionarAoCarrinho="adicionarAoCarrinho" />
    </q-page-container>

    <q-drawer v-model="menuCarrinho" side="right" overlay bordered class="bg-white cart-drawer column no-wrap"
      style="width: 500px;">
      <q-toolbar class="bg-primary text-white q-pa-xs">
        <q-btn flat dense round icon="close" @click="menuCarrinho = false" />
        <q-toolbar-title>Meu Carrinho</q-toolbar-title>
      </q-toolbar>
      <q-separator />
      <q-scroll-area class="col q-pa-sm">
        <q-list separator>
          <q-item v-for="i in 3" :key="i" class="cart-item">
            <q-item-section avatar>
              <img src="icons/estojo.webp" alt="estojo" style="width:80px; height:80px; border-radius:8px;"
                fit="contain" />
            </q-item-section>

            <q-item-section>
              <div class="row justify-between">
                <div style="font-size: 18px;" class="text-bold">
                  Estojo em Couro - Personalizado
                </div>
                <div class="q-mt-md" style="font-size: 14px;">
                  Uma ótima opção de estojo para facas para usar na cozinha da sua casa! <b>EM COURO</b> e
                  <b>Personalizada</b>
                </div>
              </div>

              <div class="row items-center justify-between q-mt-sm">
                <div class="row items-center justify-between">
                  <div style="font-size: 18px;" class="text-bold q-ml-md">
                    R$ 49,99
                  </div>
                </div>
              </div>

              <div class="row justify-end q-mt-xs">
                <q-btn color="negative" icon="delete" outline size="sm" label="Remover" style="border-radius:8px;" />
              </div>
            </q-item-section>
          </q-item>

        </q-list>
      </q-scroll-area>
    </q-drawer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const menuMobile = ref(false)
const menuCarrinho = ref(false)
const cartCount = ref(0)

const adicionarAoCarrinho = () => {
  cartCount.value++
}


</script>

<style scoped>
.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.drawer-bottom-btn {
  margin-top: auto;
  padding: 10px;
}

:deep(a.router-link-active),
:deep(a.router-link-exact-active) {
  color: var(--q-primary) !important;
}

:deep(a:hover) {
  color: var(--q-primary) !important;
}

.router-link-exact-active {
  color: var(--q-primary) !important;
}

router-link:hover {
  color: var(--q-primary) !important;
}
</style>
