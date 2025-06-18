<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-separator vertical color="white" class="q-mt-sm q-mb-sm q-mr-md q-ml-md" />
        <img
          src="icons/app-logo-sfundo.png"
          alt="Quasar Logo"
          class="q-mr-sm"
          style="width: 32px; height: 32px;">
        <q-toolbar-title>
          NegoMaq Couros
        </q-toolbar-title>

        <q-separator vertical color="white" class="q-mt-sm q-mb-sm q-mr-sm" />
        <div>
          <q-btn name="logout" flat icon="logout" cursor="pointer" size="md" class="q-mr-sm" @click="sairSistema()" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          Essential Links
        </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
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
        <div class="col-md-4 col-sm-4 col-xs-12 flex justify-center items-center">
          <q-icon name="code" size="sm" /> Ezequiel H. G. Muller - Developer
        </div>

        <div class="col-md-4 col-sm-4 col-xs-12 flex justify-center items-center">
          <q-icon name="copyright" /> 2025 Ezequiel Muller - Todos os direitos reservados
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
    title: 'Facas',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function sairSistema() {
  alert('Sair do sistema');
}
</script>
