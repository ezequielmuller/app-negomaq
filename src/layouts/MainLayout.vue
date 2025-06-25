<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="justify-between">

        <q-btn icon="shopping_cart" flat dense class="q-mr-md" />
        <q-btn icon="circle_notifications" flat dense @click="dialogInformacao = true" />

        <q-separator vertical color="white" class="q-mt-sm q-mb-sm q-mr-md q-ml-md" />

        <q-toolbar-title class="row items-center justify-center">
          <img src="icons/app-logo-sfundo.png" alt="Logo" style="width: 32px; height: 32px; margin-right: 8px;">
          <span class="text-bold">NegoMaq Couros</span>
        </q-toolbar-title>

        <q-separator vertical color="white" class="q-mt-sm q-mb-sm q-mr-md q-ml-md" />
        <q-btn flat icon="logout" size="md" @click="sairSistema()" />

      </q-toolbar>
    </q-header>


    <q-page-container>
      <router-view />
      <div class="row q-col-gutter-md justify-center items-center text-center text-grey bg-black">
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <a href="https://api.whatsapp.com/send/?phone=5554996641291&text&type=phone_number&app_absent=0"
              target="_blank" class="q-mx-sm">
              <i class="fab fa-whatsapp fa-2x" style="color: #25D366;"></i>
            </a>
            <a href="https://www.instagram.com/negomaq/" target="_blank" class="q-mx-sm">
              <i class="fab fa-instagram fa-2x" style="color: #C13584;"></i>
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

    <q-dialog v-model="dialogInformacao">
      <q-card style="width: 400px; height: 400px;">

        <q-card-section class="bg-primary text-white">
          <div class="row items-center" style="gap: 8px;">
            <q-icon name="circle_notifications" size="md" />
            <div class="text-h6">Importantes</div>
          </div>
        </q-card-section>

        <div class="q-pa-md">
          <q-card-section style="border: 2px solid #ab0d06; border-radius: 8px;">
            <div class="row items-center q-gutter-sm">
              <img src="icons/leilao-fundo.png" alt="Grupo de Leilão" style="width: 100px; height: 100px;" />
              <div style="font-size: 18px;">Grupo de Leilão</div>
            </div>
            <div align="right">
              <q-btn icon="open_in_new" label="Entrar" color="primary" v-close-popup />
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-mt-md">
            <q-btn label="Fechar" color="primary" v-close-popup />
          </q-card-actions>
        </div>

      </q-card>
    </q-dialog>



  </q-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar'
import { ref } from 'vue'

const router = useRouter()
const $q = useQuasar()

const dialogInformacao = ref(false)

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
