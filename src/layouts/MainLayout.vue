<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="q-px-md">

        <q-toolbar-title class="row items-center">
          <img src="icons/app-logo-sfundo.png" alt="Logo"
            style="width: 36px; height: 36px; margin-right: 12px; border-radius: 8px; box-shadow: 0 0 6px #0004;">
          <span class="text-bold text-h6">NegoMaq Couros</span>
        </q-toolbar-title>

        <div class="row items-center q-gutter-sm">
          <q-btn round dense flat class="bg-white text-primary">
            <q-icon name="shopping_cart" />
            <q-badge v-if="cartCount > 0" color="warning" floating class="text-black shadow-lg"
              style="font-weight: 700; font-size: 14px; min-width: 22px; height: 22px; border-radius: 12px; box-shadow: 0 0 8px rgba(255, 193, 7, 0.7);">
              {{ cartCount }}
            </q-badge>

          </q-btn>

          <q-btn round dense flat icon="circle_notifications" class="bg-white text-primary"
            @click="dialogInformacao = true" />

          <q-separator vertical color="white" size="3px" class="q-mx-md" />

          <q-btn round dense flat icon="logout" class="bg-white text-negative" @click="sairSistema()" />
        </div>

      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view :adicionarAoCarrinho="adicionarAoCarrinho" />

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

    <q-dialog v-model="dialogInformacao">
      <q-card style="width: 400px; max-height: 90vh;" class="column no-wrap">

        <q-card-section class="bg-primary text-white">
          <div class="row items-center" style="gap: 8px;">
            <q-icon name="circle_notifications" size="md" />
            <div class="text-h6">Importantes</div>
          </div>
        </q-card-section>

        <div class="q-pa-md scroll" style="flex: 1;">
          <q-card-section style="border: 2px solid #ab0d06; border-radius: 8px;">
            <div class="column q-gutter-md">
              <div class="row items-center" style="gap: 8px;">
                <q-icon name="error" color="black" size="sm" />
                <div class="text-subtitle1">Entre no nosso grupo de Leilão</div>
              </div>

              <div class="row items-center justify-between">
                <img src="icons/leilao-fundo.png" alt="Grupo de Leilão"
                  style="width: 90px; height: 90px; border: 2px solid black; border-radius: 4px;" />

                <q-btn color="positive" no-caps unelevated @click="abrirGrupoLeilao()">
                  <template v-slot:default>
                    <i class="fab fa-whatsapp fa-lg q-mr-sm" style="color: white;"></i>
                    <span class="text-white">ENTRAR</span>
                  </template>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </div>

        <q-separator color="grey" style="height: 1px;" />
        <q-card-actions align="right" class="q-pa-sm">
          <q-btn label="Fechar" color="primary" v-close-popup icon="close" />
        </q-card-actions>

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
const cartCount = ref(0) // contador do carrinho

const adicionarAoCarrinho = () => {
  cartCount.value++
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

const abrirGrupoLeilao = () => {
  window.open('https://chat.whatsapp.com/FB2vjot6F5y1eYsM6nHwRM', '_blank')
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
