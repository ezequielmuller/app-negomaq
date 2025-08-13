<template>
  <!-- Título -->
  <div class="text-h6 text-center text-bold q-mt-md">
    Aventais
  </div>

  <!-- Pesquisa e botão de filtros -->
  <div class="flex flex-center q-mt-md gap-4 flex-wrap">
    <q-input flat v-model="pesquisa" label="Pesquise por Produtos!" style="width: 700px; max-width: 90vw;">
      <template #prepend>
        <q-icon name="search" />
      </template>
    </q-input>

    <q-btn color="primary" icon="attach_money" class="q-mt-md" @click="dialogFiltros = true" />
  </div>

  <q-separator class="q-my-md" color="primary" style="height: 3px;" />

  <!-- Lista de produtos -->
  <div v-if="produtosFiltrados.length" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 16px;">
    <q-card v-for="produto in produtosFiltrados" :key="produto.id" class="q-mt-md"
      style="width: 350px; max-width: 95vw; min-width: 220px; display: flex; flex-direction: column;">

      <q-card-section class="flex justify-center items-center h-[200px] pb-0">
        <img src="/public/icons/aventais.jpeg" :alt="produto.nome"
          class="w-auto max-w-full h-full object-contain rounded-[10px] shadow-md" />
      </q-card-section>

      <q-card-section class="flex flex-col flex-1">
        <div class="text-bold text-[18px]">
          {{ produto.nome }}
        </div>
        <div class="text-[14px] q-mt-sm">
          {{ produto.descricao }}
        </div>

        <div class="row items-center justify-between q-mt-auto q-pt-sm gap-2">
          <div class="text-bold text-primary text-[18px]">
            R$ {{ formatarPreco(produto.preco) }}
          </div>
          <q-btn color="primary" icon="add_shopping_cart" label="Adicionar" class="rounded-[10px]"
            @click="props.adicionarAoCarrinho" />
        </div>
      </q-card-section>
    </q-card>
  </div>
  <div v-else class="text-center text-grey q-mt-md flex flex-col justify-center items-center">
    <q-icon name="error" size="xl" color="grey" />
    <span class="font-bold q-mt-sm">Nenhum produto encontrado!</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from 'src/services/api'
import type { Produto } from 'src/types/types'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const props = defineProps<{
  adicionarAoCarrinho: () => void
}>()

const pesquisa = ref('')
// const precoInicial = ref(50)
// const precoFinal = ref(400)
const dialogFiltros = ref(false)
const produtos = ref<Produto[]>([])

const listarProdutos = async () => {
  try {
    $q.loading.show({ message: 'Buscando Produtos...' })
    const result = await api.get('/produtos')
    produtos.value = result.data
  } catch (error) {
    console.log('Erro==> ', error)
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

const produtosFiltrados = computed(() =>
  produtos.value.filter(
    (p) =>
      p.categoria === 'aventais' &&
      p.nome.toLowerCase().includes(pesquisa.value.toLowerCase())
  )
)

function formatarPreco(preco: string | number) {
  return Number(preco).toFixed(2).replace('.', ',')
}

onMounted(async () => {
  await listarProdutos()
})
</script>
