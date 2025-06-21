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

      <div class="row q-col-gutter-md justify-center items-center text-center text-grey bg-black">
        <div class="row q-col-gutter-md">
          <div class="col-12 flex justify-end items-center">
            <a href="" target="_blank">
              <q-btn flat color="grey" icon="call" size="md" />
            </a>
            <a href="" target="_blank">
              <q-btn flat color="grey" icon="attach_email" size="md" />
            </a>
          </div>
        </div>

        <div class="col-12 flex justify-center items-center"
          style="text-align: center; font-size: 0.7rem; padding: 1.5rem">
          <q-icon name="copyright" />
          <span class="q-ml-xs">
            2025 Todos os direitos reservados - Couros NegoMaq
          </span>
        </div>
      </div>
    </q-page-container>

    <!-- <q-footer class="text-grey bg-black">

      ========== RODAPÉ ==========

    </q-footer> -->
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar'
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';
const router = useRouter()
const $q = useQuasar()

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
    link: '/estojos-facas'
  },
  {
    title: 'Aventais',
    caption: 'Aventais - Variados',
    icon: 'dry_cleaning',
    link: 'aventais'
  },
  {
    title: 'Artigos de Churrasco',
    caption: 'Diversos artigos de churrasco',
    icon: 'outdoor_grill',
    link: 'artigos-churrasco'
  },
];

const leftDrawerOpen = ref(true);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const sairSistema = async () => {
  try {
    $q.loading.show({ message: 'Saindo...' })

    localStorage.removeItem('usuario')
    await router.push('/')
  } catch (error) {
    console.log('ERRO SAIR SISTEMA=> ', error)
    $q.notify({
      type: 'negative',
      message: 'Não foi possivel sair do Sistema!',
      position: 'center',
      timeout: 2000
    })
  } finally {
    $q.loading.hide()
  }
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
