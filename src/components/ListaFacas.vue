<template>
  <div class="text-h6 flex flex-center text-bold">
    Facas
  </div>

  <div class="flex flex-center q-mt-md q-mb-mt">
    <q-input flat v-model="pesquisa" label="Pesquise por Produtos!" class="input-pesquisa">
      <template #prepend>
        <q-icon name="search" />
      </template>
    </q-input>
  </div>

  <div class="q-mt-xl" style="max-width: 400px; margin: 0 auto;">
    <div class="flex flex-center text-bold q-mt-md" style="font-size: 16px;">Filtro de Preço</div>
    <q-slider v-model="precoInicial" color="primary" :min="50" :max="400" :step="50" markers label
      :label-value="`R$ ${precoInicial}`" />
    <q-slider v-model="precoFinal" color="primary" :min="precoInicial" :max="400" :step="50" markers label
      :label-value="`R$ ${precoFinal}`" />

    <div class="slider-labels text-bold"
      style="display: flex; justify-content: space-between; font-size: 13px; margin-top: 4px;">
    </div>
  </div>
  <q-separator class="q-mt-md q-mb-mt" color="primary" style="height: 3px;" />

  <!-- Lista de produtos -->
  <div v-if="produtosFiltrados.length" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 16px;">
    <q-card v-for="produto in produtosFiltrados.filter(p => p.categoria === 'facas')" :key="produto.id"
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
          <q-btn color="primary" icon="add_shopping_cart" label="Adicionar" style="border-radius: 10px"
            @click="props.adicionarAoCarrinho" />
        </div>
      </q-card-section>
    </q-card>
  </div>

  <!-- Nenhum produto encontrado -->
  <div v-else class="text-center text-grey q-mt-md flex flex-center"
    style="flex-direction: column; align-items: center;">
    <q-icon name="error" size="xl" color="grey" />
    <span class="text-bold q-mt-sm">Nenhum produto encontrado!</span>
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
const precoInicial = ref(50)
const precoFinal = ref(400)

const produtos = ref<Produto[]>([])

const produtosFiltrados = computed(() => {
  return produtos.value.filter((p) => {
    const nomeOk = p.nome.toLowerCase().includes(pesquisa.value.toLowerCase())
    const precoOk = Number(p.preco) >= precoInicial.value && Number(p.preco) <= precoFinal.value
    return nomeOk && precoOk
  })
})

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
