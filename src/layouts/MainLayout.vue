<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">

      <!-- MENU DESKTOP -->
      <q-toolbar class="q-px-lg">
        <q-toolbar-title class="row items-center">
          <span class="text-bold text-h6 text-white">NegoMaq</span>
        </q-toolbar-title>

        <div class=" row items-center q-gutter-md gt-sm">
          <router-link :to="{ name: 'home' }"
            class="no-underline text-white hover:scale-110 duration-300">Home</router-link>
          <router-link :to="{ name: 'home-facas-page' }"
            class="no-underline text-white hover:scale-110 duration-300">Facas</router-link>
          <router-link :to="{ name: 'home-estojo-page' }"
            class="no-underline text-white hover:scale-110 duration-300">Estojos</router-link>
          <router-link :to="{ name: 'home-avental-page' }"
            class="no-underline text-white hover:scale-110 duration-300">Aventais</router-link>
          <router-link :to="{ name: 'home-artigo-churrasco-page' }"
            class="no-underline text-white hover:scale-110 duration-300">Artigos de
            Churrasco</router-link>

          <q-separator vertical color="white"
            style="margin-left: 10px; margin-right: 10px; margin-top: 17px; margin-bottom: 1px;" />
        </div>

        <div class="row items-center q-gutter-sm gt-sm">
          <q-btn round dense flat class="text-white  hover:scale-110 duration-300" @click="menuCarrinho = true">
            <q-icon name="shopping_cart" />
            <q-badge v-if="cartCount > 0" color="warning" floating class="text-black flex flex-center"
              style=" font-weight: 700; font-size: 13px; width: 24px; height: 24px; border-radius: 50%; box-shadow: 0 0 6px rgba(0,0,0,0.3); top: -6px; right: -6px; position: absolute;">
              {{ cartCount }}
            </q-badge>
            <q-tooltip>Meu Carrinho</q-tooltip>
          </q-btn>

          <q-btn v-if="user" round dense flat icon="manage_accounts" :to="{ name: 'home-user-page' }"
            class="text-white  hover:scale-110 duration-300">
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
        <q-item clickable :to="{ name: 'home' }">
          <q-item-section avatar><q-icon name="home" /></q-item-section>
          <q-item-section>Home</q-item-section>
        </q-item>

        <q-item clickable :to="{ name: 'home-facas-page' }">
          <q-item-section avatar><q-icon name="restaurant" /></q-item-section>
          <q-item-section>Facas</q-item-section>
        </q-item>

        <q-item clickable :to="{ name: 'home-estojo-page' }">
          <q-item-section avatar><q-icon name="takeout_dining" /></q-item-section>
          <q-item-section>Estojos</q-item-section>
        </q-item>

        <q-item clickable :to="{ name: 'home-avental-page' }">
          <q-item-section avatar><q-icon name="checkroom" /></q-item-section>
          <q-item-section>Aventais</q-item-section>
        </q-item>

        <q-item clickable :to="{ name: 'home-artigo-churrasco-page' }">
          <q-item-section avatar><q-icon name="outdoor_grill" /></q-item-section>
          <q-item-section>Artigos de Churrasco</q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable @click="menuCarrinho = true">
          <q-item-section avatar><q-icon name="shopping_cart" /></q-item-section>
          <q-item-section>Meu Carrinho</q-item-section>
          <q-item-section side v-if="cartCount > 0">
            <q-badge color="warning" class="text-black">{{ cartCount }}</q-badge>
          </q-item-section>
        </q-item>

        <template v-if="user">
          <q-item clickable :to="{ name: 'home-user-page' }">
            <q-item-section avatar><q-icon name="manage_accounts" /></q-item-section>
            <q-item-section>Painel de Usuário</q-item-section>
          </q-item>
        </template>
        <template v-else>
          <q-item clickable :to="{ name: 'login' }" class="text-primary text-bold">
            <q-item-section avatar><q-icon name="login" /></q-item-section>
            <q-item-section>Faça Login</q-item-section>
          </q-item>
        </template>
      </q-list>


      <div class="q-pa-md text-center bg-primary text-white text-bold">
        NegoMaq - V.1.0.0
      </div>
    </q-drawer>

    <!-- PAGINA PRINCIPAL -->
    <q-page-container>
      <q-page-sticky v-if="!menuMobile && !menuCarrinho" position="bottom-right" :offset="[18, 18]"
        style="z-index: 9999;">

        <q-btn fab color="amber-9" unelevated class="text-white flex items-center gap-2 q-mb-sm hover-scale"
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
      <div class="text-grey bg-black q-mt-md">
        <div class="row q-col-gutter-md justify-center items-center text-center">

          <div class="col-12 flex justify-center items-center q-pt-sm" style="text-align: center; font-size: 0.7rem;">
            <a href="https://api.whatsapp.com/send/?phone=5554996641291&text&type=phone_number&app_absent=0"
              target="_blank" class="q-mx-sm">
              <i class="fab fa-whatsapp fa-2x" style="color: #25D366;"></i>
            </a>
            <a href="https://www.instagram.com/negomaq/" target="_blank" class="q-mx-sm">
              <i class="fab fa-instagram fa-2x" style="color: #C13584;"></i>
            </a>
          </div>

          <div class="col-12 flex justify-center items-center q-pt-xs"
            style="text-align: center; font-size: 0.7rem; padding-bottom: 0.6rem;">
            <q-icon name="copyright" />
            <span class="q-ml-xs">
              2025 Todos os direitos reservados - NegoMaq Couros
            </span>
          </div>
        </div>
      </div>
    </q-page-container>

    <!-- MENU CARRINHO -->
    <q-drawer v-model="menuCarrinho" side="right" overlay bordered class="bg-white cart-drawer column no-wrap"
      style="width: 450px;">
      <q-toolbar class="bg-primary text-white q-pa-xs">
        <q-btn flat dense round icon="close" @click="menuCarrinho = false" />
        <q-toolbar-title style="font-size: 18px;">Meu Carrinho</q-toolbar-title>
      </q-toolbar>

      <q-scroll-area class="col q-pa-md">
        <q-list separator>

          <q-item v-for="(item, index) in carrinho" :key="index" class="cart-item q-pa-sm"
            style="border-radius: 12px; margin-bottom: 8px; transition: all 0.2s; border-radius: 20px; border: 0.6mm solid #e9e9e9;">

            <q-item-section avatar>
              <img :src="item.img || ''" :alt="item.nome"
                style="width:80px; height:80px; border-radius:12px; object-fit: cover;" />
            </q-item-section>

            <q-item-section class="q-ml-sm scroll">
              <div class="text-bold" style="font-size: 16px;">{{ item.nome }}</div>
              <div class="text-grey">{{ item.descricao }}</div>
              <div class="text-bold q-mt-xs text-primary" style="font-size: 16px;">{{ item.preco }}</div>
              <div class="row justify-between q-mt-sm">
                <q-btn flat color="negative" icon="add" round size="sm" @click="quantidadeProduto++"
                  style="width: 20px;" />
                <span class="q-mt-sm">{{ quantidadeProduto }}</span>
                <q-btn flat color="negative" icon="remove" size="sm" round @click=" quantidadeProduto--" />
                <q-separator vertical color="primary" />
                <q-btn color="negative" icon="delete" round dense flat @click="removerDoCarrinho(index)" />
              </div>
            </q-item-section>
          </q-item>

          <div v-if="carrinho.length === 0"
            class="text-center text-grey q-mt-md flex flex-col justify-center items-center">
            <q-icon name="production_quantity_limits" size="md" color="grey" />
            <span class="font-bold q-mt-sm">Seu carrinho esta vazio!</span>
          </div>
        </q-list>
      </q-scroll-area>

      <q-separator />

      <div class="q-pa-md" style="padding-top: 8px;">
        <div class="row text-bold" style="font-size: 16px;">Subtotal: {{ formatCurrency(0) }}</div>
        <div class="q-mt-mt" style="padding-top: 8px;">
          <q-btn color="primary" class="full-width hover-scale" label="Finalizar Compra" @click="finalizarCompra"
            unelevated :disable="carrinho.length === 0" style="border-radius: 20px;" />
        </div>
      </div>
    </q-drawer>

    <!-- DIALOG DE NOTIFICAÇÕES -->
    <q-dialog v-model="dialogNotificacao" persistent>
      <q-card
        style="width: 400px; max-height: 60vh; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.2);"
        class="column no-wrap">
        <q-card-section class="bg-amber-9 text-white" style="padding: 16px;">
          <div class="row items-center" style="gap: 8px">
            <q-icon name="notifications_active" size="md" />
            <div class="text-h6 text-bold">Notificações</div>
          </div>
        </q-card-section>
        <q-card-section style="padding: 16px;">
          <q-card flat bordered style="border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <q-card-section>
              <div class="row justify-between items-center" style="gap: 16px;">
                <div class="col">
                  <div class="text-subtitle1 text-bold">Grupo de Leilão</div>
                  <div class="text-body2 q-mt-sm">
                    Fique por dentro dos leilões, receba notificações de novos produtos e ofertas exclusivas.
                  </div>
                </div>
                <div class="col flex flex-center flex-column" style="gap: 8px;">
                  <img src="/public/icons/leilao-fundo.png" alt="Imagem do grupo de leilao"
                    style="width: 110px; height: 100px; object-fit: cover; border-radius: 8px;" />
                  <q-btn color="green" class="full-width" @click="abrirGrupoLeilao" style="border-radius: 20px;">
                    <i class="fab fa-whatsapp fa-lg text-white q-mr-sm"></i>
                    Entrar
                  </q-btn>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-card-section>
        <q-separator style="height: 3px;" class="bg-amber-9 q-mx-md" />
        <q-card-actions align="right" class="q-mr-sm q-mb-xs">
          <q-btn icon="close" class="hover-scale" outline label="Fechar" color="amber-9" v-close-popup
            style="border-radius: 20px;" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-layout>
</template>

<script setup lang="ts">
import { useAuth } from 'src/composables/useAuth'
//import { usePlatform } from 'src/composables/usePlatform'
import { formatPrice } from 'src/config/formatPrice'
import { onMounted, ref } from 'vue'

const { getUser } = useAuth()
const user = getUser()

//const mobile = usePlatform()
const menuMobile = ref(false)
const dialogNotificacao = ref(false)

interface Produto {
  id: string
  nome: string
  descricao: string
  categoria: string
  preco: number
  estoque: number
  img?: string
}

// carrinho
const carrinho = ref<Produto[]>([])
const menuCarrinho = ref(false)
const cartCount = ref(0)
const quantidadeProduto = ref(1)

const adicionarAoCarrinho = (produto: Produto) => {
  carrinho.value.push(produto)
  menuCarrinho.value = true
}

const removerDoCarrinho = (index: number) => {
  carrinho.value.splice(index, 1)
}

// const subtotalCarrinho = computed(() => {
//   const qtdItens = carrinho.value.reduce((total, item) => total + item.estoque, 0)
//   console.log('Quantidade de itens no carrinho=====> ', qtdItens)
//   return qtdItens
// })

const enviarWhatsapp = () => {
  const nome = 'Lucas'
  const numero = '55548449-5095'
  const celularFormatado = numero.replace(/\D/g, '')
  const telefone = celularFormatado.startsWith('55') ? celularFormatado : '55' + celularFormatado
  const mensagem = `Olá, *${nome}*, tudo bem?\nTeste de contato com o whatsapp do negomaq`
  const mensagemCodificada = encodeURIComponent(mensagem)
  window.open(`https://api.whatsapp.com/send?phone=${telefone}&text=${mensagemCodificada}`, '_blank')
}

const finalizarCompra = () => {
  if (carrinho.value.length === 0) {
    alert('Seu carrinho está vazio!')
    return
  }
  const mensagem = encodeURIComponent(
    `Olá, quero comprar:\n${carrinho.value.map(p => `- ${p.nome} (${p.preco})`).join('\n')}`
  )
  window.open(`https://wa.me/555484495095?text=${mensagem}`, '_blank')
  carrinho.value = []
  menuCarrinho.value = false
}

const abrirGrupoLeilao = () => {
  window.open('https://chat.whatsapp.com/FB2vjot6F5y1eYsM6nHwRM', '_blank')
}

const abrirNotificacao = () => {
  dialogNotificacao.value = true
}

// formatar pra moeda (string)
function formatCurrency(value: number) {
  return formatPrice(value)
}

onMounted(() => {
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
.soft-pulse-badge {
  animation: soft-pulse 1s infinite ease-in-out;
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
