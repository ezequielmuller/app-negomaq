<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="justify-between">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-separator vertical color="white" class="q-mt-sm q-mb-sm q-mr-md q-ml-md" />

        <q-toolbar-title class="row items-center justify-center">
          <img src="icons/app-logo-sfundo.png" alt="Logo" style="width: 32px; height: 32px; margin-right: 8px;">
          <span class="text-bold">NegoMaq Couros</span>
        </q-toolbar-title>

        <q-separator vertical color="white" class="q-mt-sm q-mb-sm q-mr-md q-ml-md" />
        <q-btn flat icon="logout" size="md" @click="sairSistema()" />

      </q-toolbar>
    </q-header>


    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <div class="drawer-content text-black">
        <q-list>
          <img src="icons/app-logo-sfundo.png" alt="Logo" style="width: 60px; height: 60px; margin-left: 115px" />

          <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
        </q-list>
        <div class="drawer-bottom-btn">
          <q-btn color="primary" icon="support_agent" label="FALE CONOSCO" @click="sairSistema()"
            style="width: 100%;" />
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="text-grey bg-black">
      <!-- <div class="row q-col-gutter-md">
        <div class="col-12 flex justify-end items-center">
          <a href="https://github.com/ezequielmuller" target="_blank">
            <q-btn color="#e7e7e7" icon="fab fa-github" size="md" />
          </a>
          <a href="https://linkedin.com/in/ezequielhgmuller" target="_blank">
            <q-btn icon="fab fa-linkedin" size="md" color="#e7e7e7" />
          </a>
          <a href="https://www.instagram.com/ezequielmuller__/" target="_blank">
            <q-btn icon="fab fa-instagram" size="md" color="#e7e7e7" />
          </a>
          <a href="https://www.instagram.com/ezequielmuller__/" target="_blank">
            <q-btn icon="fab fa-x-twitter tex" size="md" lable="as" color="#e7e7e7" />
          </a>
        </div>
      </div> -->
      <div class="row q-col-gutter-md justify-center items-center text-center">
        <!-- <div class="col-md-4 col-sm-4 col-xs-12 flex justify-center items-center">
          <q-icon name="code" size="sm" /> Ezequiel H. G. Muller - Developer
        </div> -->

        <div class="col-12 flex justify-center items-center"
          style="background-color: 'black'; color: 'grey'; text-align: 'center'; font-size: '0.8rem'; padding: 2.5,">
          <q-icon name="copyright" /> 2025 Todos os direitos reservados - Ezequiel H. G. Muller | Enzo B. de Oliveira |
          Lucas Blanger
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';

const linksList: EssentialLinkProps[] = [
  {
    title: 'Inicio',
    caption: 'Página Inicial',
    icon: 'home',
    link: '/home'
  },
  {
    title: 'Facas',
    caption: 'Facas de todos os tipos',
    icon: 'restaurant',
    link: '/facas'
  },
  {
    title: 'Estojos de Facas',
    caption: 'Estojos em couros para facas',
    icon: 'width_wide',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Aventais',
    caption: 'Aventais - Variados',
    icon: 'dry_cleaning',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Artigos de Churrasco',
    caption: 'Diversos artigos de churrasco',
    icon: 'outdoor_grill',
    link: 'https://twitter.quasar.dev'
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function sairSistema() {
  alert('Sair do sistema');
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
</style>
