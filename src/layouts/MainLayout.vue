<template>
  <q-layout view="lHh Lpr lFf" container style="min-height: 100vh;">
    <!-- HEADER -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="q-pa-xs">
        <q-toolbar-title class="row items-center">
          <img src="icons/app-logo-sfundo.png" alt="Logo da Empresa" class="cursor-pointer"
            style="width: 60px; height: 50px" @click="navegarPraHome" />
          <span class="text-bold text-h6 text-white">NegoMaq</span>
        </q-toolbar-title>

        <div class="row items-center q-gutter-md gt-sm">
          <router-link :to="{ name: 'home' }"
            class="no-underline text-white hover:scale-110 duration-300">Home</router-link>
          <router-link :to="{ name: 'home-facas-page' }"
            class="no-underline text-white hover:scale-110 duration-300">Facas</router-link>
          <router-link :to="{ name: 'home-estojo-page' }"
            class="no-underline text-white hover:scale-110 duration-300">Estojos</router-link>
          <router-link :to="{ name: 'home-avental-page' }"
            class="no-underline text-white hover:scale-110 duration-300">Aventais</router-link>
          <router-link :to="{ name: 'home-artigo-churrasco-page' }"
            class="no-underline text-white hover:scale-110 duration-300">Artigos de Churrasco</router-link>
          <q-separator vertical color="white" style="margin: 0 10px; margin-top: 17px;" />
        </div>

        <div class="row items-center q-gutter-sm gt-sm">
          <q-btn round dense flat class="text-white hover:scale-110 duration-300" @click="menuCarrinho = true">
            <q-icon name="shopping_cart" />
            <q-badge v-if="cartCount > 0" color="warning" floating class="text-black flex flex-center"
              style="font-weight: 700; font-size: 13px; width: 24px; height: 24px; border-radius: 50%; box-shadow: 0 0 6px rgba(0,0,0,0.3); top: -6px; right: -6px; position: absolute;">
              {{ cartCount }}
            </q-badge>
            <q-tooltip>Meu Carrinho</q-tooltip>
          </q-btn>

          <q-btn v-if="user" round dense flat icon="manage_accounts" :to="{ name: 'home-user-page' }"
            class="text-white hover:scale-110 duration-300">
            <q-tooltip>Painel de Usuário</q-tooltip>
          </q-btn>
          <q-btn v-else outline dense icon="login" :to="{ name: 'login' }" label="FAÇA LOGIN"
            class="hover-scale q-pr-sm" color="white"
            style="border-radius: 20px; background-color: #FFB8B8; border: 2px solid var(--q-primary); color: var(--q-primary)">
            <q-tooltip>Faça Login</q-tooltip>
          </q-btn>
        </div>

        <q-btn dense flat round icon="menu" class="lt-md" @click="menuMobile = true" />
      </q-toolbar>
    </q-header>

    <!-- MENU MOBILE -->
    <q-drawer v-model="menuMobile" side="right" bordered class="column justify-between">
      <q-list>
        <q-item clickable :to="{ name: 'home' }"><q-item-section avatar><q-icon
              name="home" /></q-item-section><q-item-section>Home</q-item-section></q-item>
        <q-item clickable :to="{ name: 'home-facas-page' }"><q-item-section avatar><q-icon
              name="restaurant" /></q-item-section><q-item-section>Facas</q-item-section></q-item>
        <q-item clickable :to="{ name: 'home-estojo-page' }"><q-item-section avatar><q-icon
              name="takeout_dining" /></q-item-section><q-item-section>Estojos</q-item-section></q-item>
        <q-item clickable :to="{ name: 'home-avental-page' }"><q-item-section avatar><q-icon
              name="checkroom" /></q-item-section><q-item-section>Aventais</q-item-section></q-item>
        <q-item clickable :to="{ name: 'home-artigo-churrasco-page' }"><q-item-section avatar><q-icon
              name="outdoor_grill" /></q-item-section><q-item-section>Artigos de Churrasco</q-item-section></q-item>

        <q-separator />
        <q-item clickable @click="menuCarrinho = true">
          <q-item-section avatar><q-icon name="shopping_cart" /></q-item-section>
          <q-item-section>Meu Carrinho</q-item-section>
          <q-item-section side v-if="cartCount > 0"><q-badge color="warning" class="text-black">{{ cartCount
              }}</q-badge></q-item-section>
        </q-item>

        <template v-if="user">
          <q-item clickable :to="{ name: 'home-user-page' }"><q-item-section avatar><q-icon
                name="manage_accounts" /></q-item-section><q-item-section>Painel de Usuário</q-item-section></q-item>
        </template>
        <template v-else>
          <q-item clickable :to="{ name: 'login' }" class="text-primary text-bold"><q-item-section avatar><q-icon
                name="login" /></q-item-section><q-item-section>Faça Login</q-item-section></q-item>
        </template>
      </q-list>
      <div class="q-pa-md text-center bg-primary text-white text-bold">NegoMaq - V.1.0.0</div>
    </q-drawer>

    <!-- PAGINA PRINCIPAL -->
    <q-page-container>
      <!-- BOTÕES FLUTUANTES -->
      <q-page-sticky v-if="!menuMobile && !menuCarrinho" position="bottom-right" :offset="[18, 18]"
        style="z-index: 9999;">
        <q-btn fab color="amber-9" unelevated class="notify-btn text-white flex items-center gap-2 q-mb-sm hover-scale"
          icon="notifications_active" @click="abrirNotificacao">
          <q-badge color="red" rounded floating label="!" class="soft-pulse-badge" />
        </q-btn>
        <q-btn fab class="hover-scale" color="green" @click="enviarWhatsapp()">
          <i class="fab fa-whatsapp fa-2x text-white"></i>
        </q-btn>
      </q-page-sticky>

      <router-view v-slot="{ Component }" :key="$route.fullPath">
        <component :is="Component" :adicionar-ao-carrinho="adicionarAoCarrinho" />
      </router-view>
    </q-page-container>

    <!-- RODAPÉ (não fixo) -->
    <div class="bg-black text-grey q-mt-lg" height-hint="60">
      <div class="row q-col-gutter-md justify-center items-center text-center">
        <div class="col-12 flex justify-center items-center q-pt-sm" style="font-size: 0.7rem;">
          <a href="https://api.whatsapp.com/send/?phone=5554996641291&text&type=phone_number&app_absent=0"
            target="_blank" class="q-mx-sm">
            <i class="fab fa-whatsapp fa-2x" style="color: #25D366;"></i>
          </a>
          <a href="https://www.instagram.com/negomaq/" target="_blank" class="q-mx-sm">
            <i class="fab fa-instagram fa-2x" style="color: #C13584;"></i>
          </a>
        </div>
        <div class="col-12 flex justify-center items-center q-pt-xs" style="font-size: 0.7rem; padding-bottom: 0.6rem;">
          <q-icon name="copyright" />
          <span class="q-ml-xs">2025 Todos os direitos reservados - NegoMaq Couros</span>
        </div>
      </div>
    </div>

    <!-- DRAWER DO CARRINHO -->
    <q-drawer v-model="menuCarrinho" side="right" overlay bordered class="bg-white cart-drawer column no-wrap"
      style="width: 450px;">
      <q-toolbar class="bg-primary text-white q-pa-xs">
        <q-btn flat dense round icon="close" @click="menuCarrinho = false" />
        <q-toolbar-title style="font-size: 18px;">Meu Carrinho</q-toolbar-title>
      </q-toolbar>

      <q-scroll-area class="col q-pa-md">
        <q-list separator>
          <q-item v-for="(item, index) in cartStore.carrinho" :key="index" class="cart-item q-pa-sm"
            style="border-radius: 12px; margin-bottom: 8px; border: 0.6mm solid #e9e9e9;">
            <q-item-section avatar>
              <img :src="item.img || ''" :alt="item.nome"
                style="width:80px; height:80px; border-radius:12px; object-fit: cover;" />
            </q-item-section>
            <q-item-section class="q-ml-sm scroll">
              <div class="text-bold" style="font-size: 16px;">{{ item.nome }}</div>
              <div class="text-grey">{{ item.descricao }}</div>
              <div class="text-bold q-mt-xs text-primary" style="font-size: 16px;">{{ formatCurrency(item.preco) }}
              </div>
              <div class="row justify-between q-mt-sm">
                <q-btn flat color="negative" icon="add" round size="sm" @click="item.qtd = (item.qtd ?? 1) + 1" />
                <span class="q-mt-sm">{{ item.qtd }}</span>
                <q-btn flat color="negative" icon="remove" size="sm" round @click="diminuirQtd(item)" />
                <q-separator vertical color="primary" />
                <q-btn color="negative" icon="delete" round dense flat @click="removerDoCarrinho(item)" />
              </div>
            </q-item-section>
          </q-item>

          <div v-if="cartStore.carrinho.length === 0"
            class="text-center text-grey q-mt-md flex flex-col justify-center items-center">
            <q-icon name="production_quantity_limits" size="md" color="grey" />
            <span class="font-bold q-mt-sm">Seu carrinho está vazio!</span>
          </div>
        </q-list>
      </q-scroll-area>

      <q-separator />
      <div class="q-pa-md">
        <div class="row text-bold" style="font-size: 16px;">Subtotal: {{ formatCurrency(totalCarrinho) }}</div>
        <div class="q-mt-md">
          <q-btn color="primary" class="full-width hover-scale" label="Finalizar Compra" @click="finalizarCompra"
            unelevated :disable="cartStore.carrinho.length === 0" style="border-radius: 20px;" />
        </div>
      </div>
    </q-drawer>

    <!-- DIALOG DE NOTIFICAÇÕES -->
    <q-dialog v-model="dialogNotificacao" persistent>
      <q-card style="width: 400px; max-height: 60vh; border-radius: 20px; overflow: hidden;">
        <q-card-section class="bg-amber-9 text-white">
          <div class="row items-center"><q-icon name="notifications_active" size="md" />
            <div class="text-h6 text-bold q-ml-sm">Notificações</div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-card flat bordered style="border-radius: 10px;">
            <q-card-section>
              <div class="row justify-between items-center">
                <div class="col">
                  <div class="text-subtitle1 text-bold">Grupo de Leilão</div>
                  <div class="text-body2 q-mt-sm">Fique por dentro dos leilões e ofertas exclusivas.</div>
                </div>
                <div class="col flex flex-center flex-column">
                  <img src="/public/icons/leilao-fundo.png" alt="Leilão"
                    style="width: 110px; height: 100px; border-radius: 8px;" />
                  <q-btn color="green" class="full-width q-mt-sm" @click="abrirGrupoLeilao"
                    style="border-radius: 20px;">
                    <i class="fab fa-whatsapp fa-lg text-white q-mr-sm"></i> Entrar
                  </q-btn>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-card-section>
        <q-separator class="bg-amber-9 q-mx-md" />
        <q-card-actions align="right" class="q-mr-sm q-mb-xs">
          <q-btn icon="close" outline label="Fechar" color="amber-9" v-close-popup style="border-radius: 20px;" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useAuth } from 'src/composables/useAuth'
import { formatPrice } from 'src/config/formatPrice'
import { useCartStore } from 'src/stores/useCartStore'
import type { Produto } from 'src/types/types'

const router = useRouter()
const $q = useQuasar()
const { getUser } = useAuth()
const user = getUser()

const menuMobile = ref(false)
const menuCarrinho = ref(false)
const dialogNotificacao = ref(false)

// Store ---
const cartStore = useCartStore()
const cartCount = computed(() => {
  return cartStore.carrinho.reduce((total, p) => total + (p.qtd || 1), 0)
})

const navegarPraHome = async () => {
  await router.push('/home')
}

// Carrinho ---
const adicionarAoCarrinho = (produto: Produto) => {
  cartStore.adicionarAoCarrinho(produto)
  $q.notify({
    type: 'positive',
    message: `${produto.nome} adicionado ao carrinho!`,
    position: 'bottom',
    timeout: 1000
  })
  menuCarrinho.value = true
}
const removerDoCarrinho = (item: Produto) => {
  cartStore.removerDoCarrinho(item.id)
}
const diminuirQtd = (item: Produto) => {
  if ((item.qtd ?? 1) > 1) {
    item.qtd!--
  } else {
    removerDoCarrinho(item)
  }
}
const totalCarrinho = computed(() => {
  return cartStore.carrinho.reduce((sum, item) => sum + (item.preco * (item.qtd ?? 1)), 0)
})
const finalizarCompra = async () => {
  $q.loading.show({ message: 'Carregando...' })
  await router.push({ name: 'home-finalizar-venda' })
  $q.loading.hide()
}

// Botoes fixos
const abrirGrupoLeilao = () => window.open('https://chat.whatsapp.com/FB2vjot6F5y1eYsM6nHwRM', '_blank')
const abrirNotificacao = () => {
  dialogNotificacao.value = true
}
const enviarWhatsapp = () => {
  const nome = 'Lucas'
  const numero = '555484495095'
  const mensagem = `Olá, *${nome}*, tudo bem?\nTeste de contato com o whatsapp do negomaq`
  const mensagemCodificada = encodeURIComponent(mensagem)
  window.open(`https://api.whatsapp.com/send?phone=${numero}&text=${mensagemCodificada}`, '_blank')
}
// Métodos uteis
function formatCurrency(value: number) {
  return formatPrice(value)
}
onMounted(() => {
  console.log("layout mounted")
})
</script>
<style scoped>
:deep(a.router-link-active),
:deep(a.router-link-exact-active) {
  color: white !important;
}

:deep(a:hover) {
  color: white !important;
}

/* Badge pulsante */
.notify-btn {
  overflow: visible !important;
  position: relative;
}

/* badge mais visível + anel pulsante */
.soft-pulse-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-weight: 800;
  font-size: 13px;
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 3;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  border: 2px solid #fff;
  border-radius: 50%;
  background-color: #ff3b30;
  /* vermelho mais vivo */
  color: #fff;
  animation: soft-pulse 1.6s infinite cubic-bezier(.4, 0, .2, 1), soft-fade 1.6s infinite ease-in-out;
}

/* anel maior por trás da badge */
.soft-pulse-badge::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 59, 48, 0.18);
  z-index: 2;
  pointer-events: none;
  animation: ring-pulse 1.6s infinite ease-in-out;
}

/* keyframes */
@keyframes soft-pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.18);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes ring-pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.9);
    opacity: 0.6;
  }

  50% {
    transform: translate(-50%, -50%) scale(1.25);
    opacity: 0.16;
  }

  100% {
    transform: translate(-50%, -50%) scale(0.9);
    opacity: 0.0;
  }
}

@keyframes soft-fade {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.95;
  }

  100% {
    opacity: 1;
  }
}

.cart-item {
  background-color: #ffffff;
  border-radius: 12px;
  margin-bottom: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.cart-item:hover {
  background-color: gainsboro
}

.cart-drawer {
  border-radius: 12px;
}

.cart-item img {
  border-radius: 12px;
  object-fit: cover;
}
</style>
