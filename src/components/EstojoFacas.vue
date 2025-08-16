<template>
  <div class="text-h6 flex flex-center text-bold">
    Estojos de Facas
  </div>

  <div class="flex flex-center q-mt-md">
    <q-input flat v-model="pesquisa" label="Pesquise por Produtos!" style="width: 700px; max-width: 90vw;">
      <template #prepend>
        <q-icon name="search" />
      </template>
    </q-input>

    <q-btn color="primary" icon="attach_money" class="q-ml-lg q-mt-md" @click="dialogFiltros = true" />

  </div>

  <q-separator class="q-mt-md q-mb-mt" color="primary" style="height: 3px;" />

  <!-- Lista de produtos -->
  <div v-if="produtosFiltrados.length" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 16px;">
    <q-card v-for="produto in produtosFiltrados" :key="produto.id" class="q-mt-md"
      style="width: 350px; max-width: 95vw; min-width: 220px; display: flex; flex-direction: column;">

      <q-card-section class="flex justify-center items-center h-[200px] pb-0">
        <img :src="produto.img || '/icons/estojo.webp'" :alt="produto.nome"
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
          <q-btn color="primary" icon="add_shopping_cart" label="Adicionar" class="rounded-[10px]" @click="props.adicionarAoCarrinho({
            nome: produto.nome,
            descricao: produto.descricao,
            preco: `R$ ${formatarPreco(produto.preco)}`,
            img: produto.img || '/icons/faca.webp'
          })" />
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
import { useQuasar } from 'quasar';

const $q = useQuasar()

const props = defineProps<{
  adicionarAoCarrinho: (produto: {
    nome: string
    descricao: string
    preco: string
    img: string
  }) => void
}>()

const pesquisa = ref('')
// const precoMin = ref('')
// const precoMax = ref('')

const dialogFiltros = ref(false)

const produtos = ref<Produto[]>([])
const listarProdutos = async () => {
  try {
    $q.loading.show({ message: 'Buscando Produtos...' })
    const result = await api.get('/produtos')
    produtos.value = result.data
    $q.loading.hide()
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
const produtosFiltrados = computed(() =>
  produtos.value.filter(
    (p) =>
      p.categoria === 'estojos' &&
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

<!-- Configurações para telas menores-->
<style scoped>
.input-pesquisa {
  width: 700px;
  max-width: 90vw;
}
</style>
