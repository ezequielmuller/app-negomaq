<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-white text-black">
      <q-toolbar class="q-px-lg">

        <q-toolbar-title class="row items-center">
          <span class="text-bold text-h6 text-primary">NegoMaq</span>
        </q-toolbar-title>

        <div class="row items-center q-gutter-md gt-sm">
          <router-link :to="{ name: 'home' }" class="no-underline text-grey-8">Home</router-link>
          <router-link :to="{ name: 'home-facas-page' }" class="no-underline text-grey-8">Facas</router-link>
          <router-link :to="{ name: 'home-estojo-page' }" class="no-underline text-grey-8">Estojos</router-link>
          <router-link :to="{ name: 'home-avental-page' }" class="no-underline text-grey-8">Aventais</router-link>
          <router-link :to="{ name: 'home-artigo-churrasco-page' }" class="no-underline text-grey-8">Artigos de
            Churrasco</router-link>
        </div>

        <div class="row items-center q-gutter-sm q-ml-md gt-sm">
          <q-btn round dense flat icon="manage_accounts" :to="{ name: 'home-user-page' }" class="text-grey-8">
            <q-tooltip>Painel de Usuário</q-tooltip>
          </q-btn>

          <q-btn round dense flat class="text-grey-8" @click="menuCarrinho = true">
            <q-icon name="shopping_cart" />
            <q-badge v-if="cartCount > 0" color="warning" floating class="text-black flex flex-center"
              style=" font-weight: 700; font-size: 13px; width: 24px; height: 24px; border-radius: 50%; box-shadow: 0 0 6px rgba(0,0,0,0.3); top: -6px; right: -6px; position: absolute;">
              {{ cartCount }}
            </q-badge>
            <q-tooltip>Meu Carrinho</q-tooltip>
          </q-btn>

        </div>

        <q-btn dense flat round icon="menu" class="lt-md" @click="menuMobile = true" />

      </q-toolbar>
    </q-header>

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
          <q-item-section avatar><q-icon name="work" /></q-item-section>
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

        <q-item clickable :to="{ name: 'home-user-page' }">
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

      <div class="q-pa-md text-center bg-primary text-white text-bold">
        NegoMaq
      </div>
    </q-drawer>

    <q-page-container>
      <q-page-sticky position="bottom-right" :offset="[18, 18]" style="z-index: 9999;">
        <q-btn fab color="green" @click="enviarWhatsapp()">
          <i class="fab fa-whatsapp fa-2x text-white"></i>
        </q-btn>
      </q-page-sticky>

      <router-view v-slot="{ Component }" :key="$route.fullPath">
        <component :is="Component" :adicionar-ao-carrinho="adicionarAoCarrinho" />
      </router-view>
    </q-page-container>

    <!-- DRAWER CARRINHO -->
    <q-drawer v-model="menuCarrinho" side="right" overlay bordered class="bg-white cart-drawer column no-wrap"
      style="width: 500px;">
      <q-toolbar class="bg-primary text-white q-pa-xs">
        <q-btn flat dense round icon="close" @click="menuCarrinho = false" />
        <q-toolbar-title>Meu Carrinho</q-toolbar-title>
      </q-toolbar>
      <q-separator />
      <q-scroll-area class="col q-pa-sm">
        <q-list separator>
          <q-item v-for="(item, index) in carrinho" :key="index" class="cart-item">
            <q-item-section avatar>
              <img :src="item.img || ''" :alt="item.nome" style="width:80px; height:80px; border-radius:8px;"
                fit="contain" />
            </q-item-section>

            <q-item-section>
              <div style="font-size: 18px;" class="text-bold">{{ item.nome }}</div>
              <div style="font-size: 14px;">{{ item.descricao }}</div>
              <div class="text-bold q-mt-sm">{{ item.preco }}</div>

              <div class="row justify-end q-mt-xs">
                <q-btn color="negative" icon="delete" outline size="sm" label="Remover"
                  @click="removerDoCarrinho(index)" style="border-radius:8px;" />
              </div>
            </q-item-section>
          </q-item>
          <q-item v-if="carrinho.length === 0">
            <q-item-section class="text-center text-grey">
              Carrinho vazio
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-separator />
      <div class="q-pa-md">
        <q-btn color="primary" class="full-width" label="Finalizar Compra" @click="finalizarCompra" />
      </div>
    </q-drawer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const menuMobile = ref(false)
const menuCarrinho = ref(false)
const cartCount = ref(0)
const carrinho = ref<Produto[]>([])

interface Produto {
  id: string
  nome: string
  descricao: string
  categoria: string
  preco: number
  estoque: number
  img?: string
}

const enviarWhatsapp = () => {
  const nome = 'Lucas'
  const numero = '548449-5095'
  const celularFormatado = numero.replace(/\D/g, '')
  const telefone = celularFormatado.startsWith('55') ? celularFormatado : '55' + celularFormatado
  const mensagem = `Olá, *${nome}*, tudo bem?\nTeste de contato com o whatsapp do negomaq`
  const mensagemCodificada = encodeURIComponent(mensagem)
  window.open(`https://api.whatsapp.com/send?phone=${telefone}&text=${mensagemCodificada}`, '_blank')
}

const adicionarAoCarrinho = (produto: Produto) => {
  carrinho.value.push(produto)
  menuCarrinho.value = true
}

const removerDoCarrinho = (index: number) => {
  carrinho.value.splice(index, 1)
}

const finalizarCompra = () => {
  if (carrinho.value.length === 0) {
    alert('Seu carrinho está vazio!')
    return
  }

  const mensagem = encodeURIComponent(
    `Olá, quero comprar:\n${carrinho.value.map(p => `- ${p.nome} (${p.preco})`).join('\n')}`
  )
  window.open(`https://wa.me/5599999999999?text=${mensagem}`, '_blank')

  carrinho.value = []
  menuCarrinho.value = false
}

</script>

<style scoped>
:deep(a.router-link-active),
:deep(a.router-link-exact-active) {
  color: var(--q-primary) !important;
}

:deep(a:hover) {
  color: var(--q-primary) !important;
}
</style>
