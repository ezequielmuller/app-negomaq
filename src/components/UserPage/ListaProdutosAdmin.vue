<template>
  <div class="row q-col-gutter-sm">
    <div class="col-md-4 col-sm-6 col-xs-12">
      <q-input v-model="filtroNome" label="Pesquisar por nome" dense outlined debounce="300" />
    </div>
    <div class="col-md-4 col-sm-6 col-xs-12">
      <q-select v-model="filtroCategoria" :options="categorias" label="Filtrar por categoria" dense outlined emit-value
        map-options />
    </div>
    <div class="row justify-end col-md-4 col-sm-12 col-xs-12">
      <q-btn color="primary" icon="add" label="Adicionar Produto" @click="novoProduto" class="hover-scale"
        style="border-radius: 20px;" />
    </div>
  </div>
  <div class="col-12 q-mt-md">
    <q-table dense :rows="produtosFiltrados" :columns="columns" row-key="id" no-data-label="Sem Produtos"
      separator="cell" virtual-scroll style="height: 450px; border-radius: 20px;" flat bordered>
      <template v-slot:header="props">
        <q-tr :props="props" class="bg-grey-4 text-bold">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="nome" :props="props">
            {{ props.row.nome ?? '#' }}
          </q-td>
          <q-td key="descricao" :props="props">
            {{ props.row.descricao ?? "#" }}
          </q-td>
          <q-td key="preco" :props="props">
            {{ formatCurrency(props.row.preco) }}
          </q-td>
          <q-td key="categoria" :props="props">
            {{ props.row.categoria.toUpperCase() }}
          </q-td>
          <q-td key="estoque" :props="props">
            {{ props.row.estoque }}
          </q-td>
          <q-td key="peso" :props="props">
            {{ props.row.peso }}
          </q-td>
          <q-td key="comprimento" :props="props">
            {{ props.row.comprimento }}
          </q-td>
          <q-td key="altura" :props="props">
            {{ props.row.altura }}
          </q-td>
          <q-td key="largura" :props="props">
            {{ props.row.largura }}
          </q-td>
          <q-td key="actions" :props="props">
            <!-- <q-btn flat round dense icon="sell" color="green" @click="abrirPromocaoProduto(props.row)">
              <q-tooltip>
                Adicionar Promoção
              </q-tooltip>
            </q-btn> -->
            <q-btn flat round dense icon="shelves" color="blue-9" @click="abrirEstoqueProduto(props.row)">
              <q-tooltip>
                Atualizar Estoque
              </q-tooltip>
            </q-btn>
            <q-btn flat round dense icon="edit" color="amber-9" @click="abrirEditarProduto(props.row)">
              <q-tooltip>
                Editar Produto
              </q-tooltip>
            </q-btn>
            <q-btn flat round dense icon="delete" color="negative" @click="abrirDeletarProduto(props.row)">
              <q-tooltip>
                Deletar Produto
              </q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
  <ManipularProdutos v-model:dialogGravar="dialogGravar" v-model:dialogEditar="dialogEditar"
    v-model:dialog-promocao="dialogPromocao" v-model:dialogEstoque="dialogEstoque"
    v-model:dialog-excluir="dialogExcluir" :produto="produtoSelecionado" @atualizarLista="listarProdutosTela" />
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useQuasar, type QTableProps } from 'quasar'
import { listarProdutos } from 'src/services/produtoServices'
import type { Produto } from 'src/types/types'
import { formatPrice } from 'src/config/formatPrice'
import ManipularProdutos from 'src/components/ManipularProdutos.vue'

// Utils ---
const $q = useQuasar()
// Refs ---
const dialogGravar = ref(false)
const dialogEditar = ref(false)
const dialogExcluir = ref(false)
const dialogEstoque = ref(false)
const dialogPromocao = ref(false)
const produtoSelecionado = ref<Produto | null>(null)
const produtos = ref<Produto[]>([])
const filtroNome = ref('')
const filtroCategoria = ref<string | null>(null)
const categorias = [
  { label: 'Todas', value: null },
  { label: 'Facas', value: 'facas' },
  { label: 'Estojos', value: 'estojos' },
  { label: 'Aventais', value: 'aventais' },
  { label: 'Churrascos', value: 'churrascos' }
]
const columns: QTableProps['columns'] = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'center' },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'center' },
  { name: 'preco', label: 'Preço', field: 'preco', align: 'center' },
  { name: 'categoria', label: 'Categoria', field: 'categoria', align: 'center' },
  { name: 'estoque', label: 'Estoque', field: 'estoque', align: 'center' },
  { name: 'peso', label: 'Peso', field: 'peso', align: 'center' },
  { name: 'comprimento', label: 'Comprimento', field: 'comprimento', align: 'center' },
  { name: 'altura', label: 'Altura', field: 'altura', align: 'center' },
  { name: 'largura', label: 'Largura', field: 'largura', align: 'center' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' }
]

// Computed ---
const produtosFiltrados = computed(() => {
  return produtos.value.filter(p => {
    const nomeMatch = p.nome.toLowerCase().includes(filtroNome.value.toLowerCase())
    const categoriaMatch = !filtroCategoria.value || p.categoria === filtroCategoria.value
    return nomeMatch && categoriaMatch
  })
})

// Methods ---
const novoProduto = () => {
  produtoSelecionado.value = null
  dialogGravar.value = true
}
const abrirEditarProduto = (produto: Produto) => {
  produtoSelecionado.value = { ...produto }
  dialogEditar.value = true
}
const abrirDeletarProduto = (produto: Produto) => {
  produtoSelecionado.value = { ...produto }
  dialogExcluir.value = true
}
const abrirEstoqueProduto = (produto: Produto) => {
  produtoSelecionado.value = { ...produto }
  dialogEstoque.value = true
}
// const abrirPromocaoProduto = (produto: Produto) => {
//   produtoSelecionado.value = { ...produto }
//   dialogPromocao.value = true
// }

const listarProdutosTela = async () => {
  try {
    $q.loading.show({ message: 'Carregando Produtos...' })
    produtos.value = await listarProdutos()
    $q.loading.hide()
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: 'Não foi possivel carregar os produto do estoque!',
      timeout: 1500,
      position: 'bottom'
    })
  } finally {
    $q.loading.hide()
  }
}

// metodos uteis ---
function formatCurrency(value: number) {
  return formatPrice(value)
}

// Mounted ---
onMounted(() => {
  void listarProdutosTela()
})
</script>
