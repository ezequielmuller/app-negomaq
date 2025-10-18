<template>
  <q-page padding>
    <div class="text-h6 text-bold text-center q-mt-sm" style="font-size: 24px;">
      Confira nossas opções de Aventais
    </div>
    <div class="row q-col-gutter-sm justify-center q-mt-md">
      <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm">
        <q-input flat v-model="pesquisa" label="Pesquise por Produtos!" class="input-pesquisa" clearable dense
          style="width: 100%;">
          <template #prepend>
            <q-icon name="search" @click="listarProdutos" class="cursor-pointer" />
          </template>
        </q-input>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-2 q-pa-sm">
        <q-select v-model="ordenacao" :options="ordens" option-label="label" option-value="value" label="Ordenar por"
          outlined dense clearable emit-value map-options />
      </div>
    </div>
    <q-separator style="height: 3px;" class="q-my-md" />
    <div v-if="produtosFiltrados.length > 0" class="row justify-center q-col-gutter-md">
      <div v-for="produto in produtosFiltrados" :key="produto.id" class="col-12 col-sm-6 col-md-4 q-mb-md"
        style="max-width: 320px;">
        <q-card class="produto-card" style="border-radius: 20px; display: flex; flex-direction: column; height: 100%;">
          <q-card-section class="flex justify-center items-center" style="height: 200px;">
            <img :src="produto.img || '/icons/estojo.webp'" :alt="produto.nome"
              class="w-auto max-w-full h-full object-contain rounded-[10px] shadow-md" />
          </q-card-section>
          <q-separator class="q-mx-md" />
          <q-card-section class="flex flex-col flex-1">
            <div class="text-bold" style="font-size: 21px;">{{ produto.nome }}</div>
            <div class="q-mt-sm" style="font-size: 14px;">{{ produto.descricao }}</div>
            <div class="row items-center justify-between q-mt-auto q-pt-sm">
              <div class="text-bold text-primary" style="font-size: 21px;">
                R$ {{ formatarPreco(produto.preco) }}
              </div>
              <q-btn color="primary" icon="add_shopping_cart" label="Adicionar" style="border-radius: 20px;"
                @click="adicionarNoCarrinho(produto)" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div v-else class="text-center text-grey q-mt-md flex flex-col justify-center items-center">
      <q-icon name="error" size="xl" color="grey" />
      <span class="font-bold q-mt-sm">Nenhum produto encontrado!</span>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from 'src/services/api'
import type { Produto } from 'src/types/types'
import { useQuasar } from 'quasar'
import { useCartStore } from 'src/stores/useCartStore'

const $q = useQuasar()
const store = useCartStore()

// Variaveis ---
const pesquisa = ref('')
const precoRange = ref({ min: 50, max: 400 })
const produtos = ref<Produto[]>([])

// Filtro - Ordem dos produtos ---
const ordens = ref([
  { label: 'Maior Preço', value: 'precoMaior' },
  { label: 'Menor Preço', value: 'precoMenor' },
])
const ordenacao = ref('')

// Carrinho ---
const adicionarNoCarrinho = (produto: Produto) => {
  store.adicionarAoCarrinho({
    ...produto,
    qtd: 1
  })
  $q.notify({
    type: 'positive',
    message: `${produto.nome} adicionado ao carrinho!`,
    position: 'bottom',
    timeout: 1500
  })
}
const produtosFiltrados = computed(() => {
  // Input de pesquisa
  const filtrados = produtos.value.filter(
    (p) =>
      p.categoria === 'aventais' &&
      p.nome.toLowerCase().includes(pesquisa.value.toLowerCase()) &&
      Number(p.preco) >= precoRange.value.min &&
      Number(p.preco) <= precoRange.value.max
  )
  // Ordenação
  if (ordenacao.value === 'precoMaior') {
    filtrados.sort((a, b) => Number(b.preco) - Number(a.preco))
  } else if (ordenacao.value === 'precoMenor') {
    filtrados.sort((a, b) => Number(a.preco) - Number(b.preco))
  }
  return filtrados
})

// Listar produtos da API ---
const listarProdutos = async () => {
  try {
    $q.loading.show({ message: 'Buscando Produtos...' })
    const result = await api.get('/produtos')
    produtos.value = result.data
  } catch (error) {
    console.log("Erro==> ", error)
    $q.notify({
      type: 'negative',
      position: 'bottom',
      message: 'Erro ao buscar Produtos!',
      timeout: 2000
    })
  } finally {
    $q.loading.hide()
  }
}

// Métodos uteis ---
function formatarPreco(preco: string | number) {
  return Number(preco).toFixed(2).replace('.', ',')
}
onMounted(async () => {
  await listarProdutos()
})
</script>
<style scoped>
.input-pesquisa {
  width: 700px;
  max-width: 90vw;
}

@media (max-width: 600px) {
  .input-pesquisa {
    width: 300px;
  }
}

.categoria-card,
.produto-card {
  border: 1mm solid gainsboro;
  transition: box-shadow 0.2s, border-color 0.2s, transform 0.15s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.categoria-card:hover,
.produto-card:hover {
  border-color: var(--q-primary);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.13);
  z-index: 2;
  transform: translateY(-4px) scale(1.05);
}
</style>
