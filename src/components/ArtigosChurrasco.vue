<template>
  <div class="text-h6 flex flex-center text-bold">
    Estojos
  </div>

  <div class="flex flex-center q-mt-md">
    <q-input flat v-model="pesquisa" label="Pesquise por Produtos!" style="width: 700px; max-width: 90vw;">
      <template #prepend>
        <q-icon name="search" />
      </template>
    </q-input>
  </div>

  <q-separator class="q-mt-md q-mb-mt" color="primary" style="height: 3px;" />

  <div v-if="produtosFiltrados.length" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 16px;">
    <q-card v-for="produto in produtosFiltrados" :key="produto.id" class="q-mt-md"
      style="width: 350px; max-width: 95vw; min-width: 220px; display: flex; flex-direction: column;">
      <q-card-section style="display: flex; justify-content: center; align-items: center; padding-bottom: 0;">
        <img :src="produto.img || ''" :alt="produto.nome"
          style="width: 90%; max-width: 250px; height: auto; object-fit: contain; border-radius: 10px; box-shadow: 0 2px 8px #0001;" />
      </q-card-section>

      <q-card-section>
        <div style="font-size: 18px;" class="text-bold">
          {{ produto.nome }}
        </div>
        <div class="q-mt-sm" style="font-size: 14px;">
          {{ produto.descricao }}
        </div>
      </q-card-section>

      <q-card-section>
        <div class="row items-center justify-between">
          <div style="font-size: 18px;" class="text-bold q-ml-md">
            R$ {{ formatarPreco(produto.preco) }}
          </div>
          <q-btn color="primary" icon="add_shopping_cart" label="Adicionar" style="border-radius: 10px" />
        </div>
      </q-card-section>
    </q-card>
  </div>

  <div v-else class="text-center q-mt-md">
    Nenhum produto encontrado 😢
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from 'src/services/api'
import type { Produto } from 'src/types/types'

const produtos = ref<Produto[]>([])
const pesquisa = ref('')

onMounted(async () => {
  try {
    const { data } = await api.get('/produtos')
    produtos.value = data
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
  }
})

const produtosFiltrados = computed(() =>
  produtos.value.filter(
    (p) =>
      p.categoria === 'churrascos' &&
      p.nome.toLowerCase().includes(pesquisa.value.toLowerCase())
  )
)

function formatarPreco(preco: string | number) {
  return Number(preco).toFixed(2).replace('.', ',')
}
</script>
