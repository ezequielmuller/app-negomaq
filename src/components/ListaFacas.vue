<template>
  <div class="text-h6 flex flex-center text-bold">
    Facas
  </div>

  <div class="flex flex-center q-mt-md">
    <q-input flat v-model="pesquisa" label="Pesquise por Produtos!" class="input-pesquisa">
      <template #prepend>
        <q-icon name="search" />
      </template>
    </q-input>

    <q-btn color="primary" icon="attach_money" class="q-ml-lg q-mt-md" @click="dialogFiltros = true" />
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
          <q-btn color="primary" icon="add_shopping_cart" label="Adicionar" style="border-radius: 10px"
            @click="props.adicionarAoCarrinho" />
        </div>
      </q-card-section>
    </q-card>
  </div>

  <div v-else class="text-center q-mt-md">
    Nenhum produto encontrado 😢
  </div>

  <!-- ======= // DIALOG FILTROS // ========= -->
  <q-dialog v-model="dialogFiltros">
    <q-card style="width: 400px; max-height: 50vh" class="column no-wrap">
      <q-card-section class="bg-primary text-white">
        <div class="row items-center" style="gap: 8px">
          <q-icon name="attach_money" size="md" />
          <div class="text-h6">Filtrar pelo Preço</div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-12">
            <q-input dense flat outlined v-model="precoMin" label="Preço Mínimo" />
          </div>
          <div class="col-12">
            <q-input dense flat outlined v-model="precoMax" label="Preço Máximo" />
          </div>
        </div>
      </q-card-section>

      <q-separator style="height: 3px;" class="bg-primary q-mr-md q-ml-md" />

      <q-card-actions align="right" class="q-mr-sm q-mb-xs">
        <q-btn outline label="Fechar" color="primary" v-close-popup icon="close" />
        <q-btn label="Buscar" color="primary" v-close-popup icon="search" />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from 'src/services/api'
import type { Produto } from 'src/types/types'
import { useQuasar } from 'quasar';

const $q = useQuasar()

const props = defineProps<{
  adicionarAoCarrinho: () => void
}>()

const pesquisa = ref('')
const precoMin = ref('')
const precoMax = ref('')

const dialogFiltros = ref(false)

const produtos = ref<Produto[]>([])

const listarProdutos = async () => {
  try {
    $q.loading.show({ message: 'Buscando Produtos...' })
    const result = await api.get('/produtos')
    produtos.value = result
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
      p.categoria === 'facas' &&
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

<style scoped>
/* Configuração de tamanho do input conforme a plataforma*/
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
