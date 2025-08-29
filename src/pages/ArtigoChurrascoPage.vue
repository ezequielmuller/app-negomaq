<template>
  <q-page padding>
    <div class="text-h6 text-bold text-center q-mt-sm" style="font-size: 24px;">
      Confira nossas opções de Artigos de Churrascos
    </div>
    <div class="flex justify-center q-mt-md q-mb-md">
      <q-input flat v-model="pesquisa" label="Pesquise por Produtos!" class="input-pesquisa" clearable dense
        style="max-width: 700px; width: 90vw;">
        <template #prepend>
          <q-icon name="search" @click="listarProdutos" class="cursor-pointer" />
        </template>
      </q-input>
    </div>
    <div class="mx-auto q-mt-sm q-py-sm q-px-md rounded-xl shadow-md bg-grey-1 flex flex-col" style="max-width: 600px;">
      <div class="text-center text-bold" style="font-size: 16px;">Preço</div>

      <q-range v-model="precoRange" :min="50" :max="400" :step="10" label color="primary" markers drag-range
        class="q-mt-md" :left-label-value="`R$ ${formatarPreco(precoRange.min)}`"
        :right-label-value="`R$ ${formatarPreco(precoRange.max)}`" />

      <div class="flex justify-between text-bold text-primary">
        <span>R$ {{ formatarPreco(precoRange.min) }}</span>
        <span>R$ {{ formatarPreco(precoRange.max) }}</span>
      </div>
    </div>

    <q-separator style="height: 3px;" class="q-my-md" />

    <div v-if="produtosFiltrados.length" class="row q-col-gutter-md flex justify-center">
      <div v-for="produto in produtosFiltrados" :key="produto.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card class="hover-scale" style="border-radius: 20px; display: flex; flex-direction: column; height: 100%;">
          <q-card-section class="flex justify-center items-center" style="height: 200px;">
            <img :src="produto.img || '/icons/estojo.webp'" :alt="produto.nome"
              class="w-auto max-w-full h-full object-contain rounded-[10px] shadow-md"
              style="border: 1mm solid var(--q-primary);" />
          </q-card-section>
          <q-separator class="q-mx-md" />
          <q-card-section class="flex flex-col flex-1">
            <div class="text-bold" style="font-size: 21px;">{{ produto.nome }}</div>
            <div class="q-mt-sm" style="font-size: 14px;">{{ produto.descricao }}</div>

            <div class="row items-center justify-between q-mt-auto q-pt-sm">
              <div class="text-bold text-primary" style="font-size: 21px;">
                R$ {{ formatarPreco(produto.preco) }}
              </div>
              <q-btn color="primary" icon="add_shopping_cart" label="Adicionar" class="hover-scale"
                style="border-radius: 20px;" @click="props.adicionarAoCarrinho({
                  nome: produto.nome,
                  descricao: produto.descricao,
                  preco: `R$ ${formatarPreco(produto.preco)}`,
                  img: produto.img || '/icons/faca.webp'
                })" />
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
const precoRange = ref({ min: 50, max: 400 })
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
      p.categoria === 'churrascos' &&
      p.nome.toLowerCase().includes(pesquisa.value.toLowerCase()) &&
      Number(p.preco) >= precoRange.value.min &&
      Number(p.preco) <= precoRange.value.max
  )
)

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
</style>
