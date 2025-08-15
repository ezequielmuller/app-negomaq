<template>
  <q-page padding>
    <div class="row items-center">
      <q-btn flat round color="primary" icon="arrow_back" size="md" to="/" />
      <div class="text-h5 text-bold q-ml-sm">Painel do Usuário</div>
    </div>

    <q-separator class="q-mb-md" />

    <q-card class="q-pa-md q-mb-md shadow-2">
      <div class="row q-col-gutter-sm items-center">
        <div class="col-12 col-md-8 row items-center">
          <q-avatar size="60px" color="primary" text-color="white" icon="person" />
          <div class="column q-ml-md">
            <div class="text-h6">Ezequiel H. G. Muller</div>
            <div class="text-subtitle2 text-grey">zikimuller017@gmail.com</div>
          </div>
        </div>
        <div class="col-12 col-md-4 flex justify-end q-mt-sm q-mt-md-none">
          <q-btn color="primary" icon="edit" label="Editar Perfil" @click="abrirDialogEditarUsuario" />
        </div>
      </div>
    </q-card>

    <q-tabs v-model="tab" dense align="left" class="bg-primary text-white shadow-2" :breakpoint="0"
      active-color="green-4">
      <q-tab name="user" icon="person" label="Usuário" />
      <q-tab name="admin" icon="settings" label="Admin" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="user">
        <q-card class="q-pa-md q-mt-md">
          <div class="text-h6">Informações Pessoais</div>
          <q-separator spaced />
          <q-list>
            <q-item><q-item-section><q-item-label>Nome</q-item-label><q-item-label
                  caption>Ezequiel</q-item-label></q-item-section></q-item>
            <q-item><q-item-section><q-item-label>Sobrenome</q-item-label><q-item-label caption>H. G.
                  Muller</q-item-label></q-item-section></q-item>
            <q-item><q-item-section><q-item-label>Email</q-item-label><q-item-label
                  caption>zikimuller017@gmail.com</q-item-label></q-item-section></q-item>
            <q-item><q-item-section><q-item-label>Telefone</q-item-label><q-item-label caption>(54) 9
                  9922-8928</q-item-label></q-item-section></q-item>
            <q-item><q-item-section><q-item-label>Senha</q-item-label><q-item-label
                  caption>negomaq123</q-item-label></q-item-section></q-item>
          </q-list>
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="admin">
        <q-card class="q-pa-md q-mt-md">
          <div class="text-h6 q-mb-md">Lista de Produtos</div>

          <q-input v-model="filtroNome" label="Pesquisar por nome" dense outlined class="q-mb-sm" debounce="300" />
          <q-select v-model="filtroCategoria" :options="categorias" label="Filtrar por categoria" dense outlined
            emit-value map-options class="q-mb-md" />

          <q-table :rows="produtosFiltrados" :columns="colunas" row-key="id" flat bordered dense>
            <template v-slot:body-cell-acoes="props">
              <q-td class="text-center">
                <div style="display: flex; justify-content: flex-start; gap: 12px; padding-left: 24px;">
                  <q-btn flat round dense icon="edit" color="primary" @click="abrirEditarProduto(props.row)" />
                  <q-btn flat round dense icon="delete" color="negative" @click="removerProduto(props.row)" />
                </div>
              </q-td>
            </template>

          </q-table>

          <q-btn color="primary" icon="add" label="Adicionar Produto" class="q-mt-md" @click="novoProduto" />
        </q-card>

        <FacasManipular v-model:dialogGravar="dialogGravar" v-model:dialogEditar="dialogEditar"
          :produto="produtoSelecionado" @atualizarLista="listar" />
      </q-tab-panel>
    </q-tab-panels>

    <q-dialog v-model="dialogEditarUsuario" persistent>
      <q-card style="width: 400px; max-height: 50vh" class="column no-wrap">
        <q-card-section class="bg-primary text-white">
          <div class="row items-center" style="gap: 8px">
            <q-icon name="edit" size="md" />
            <div class="text-h6">Editar Perfil</div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row q-col-gutter-sm">
            <div class="col-6"><q-input dense flat outlined v-model="nome" label="Nome" /></div>
            <div class="col-6"><q-input dense flat outlined v-model="sobrenome" label="Sobrenome" /></div>
            <div class="col-12"><q-input dense flat outlined v-model="email" label="Email" /></div>
            <div class="col-12"><q-input dense flat outlined v-model="telefone" label="Telefone" /></div>
            <div class="col-12">
              <q-input dense outlined v-model="senha" :type="senhaVisivel ? 'password' : 'text'" label="Senha">
                <template v-slot:append>
                  <q-icon :name="senhaVisivel ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click="senhaVisivel = !senhaVisivel" />
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>
        <q-separator style="height: 3px;" class="bg-primary q-mr-md q-ml-md" />
        <q-card-actions align="right" class="q-mr-sm q-mb-xs">
          <q-btn icon="close" outline label="Fechar" color="primary" v-close-popup />
          <q-btn icon="save" label="Salvar" color="primary" @click="editarUsuario" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import FacasManipular from 'src/components/facas/FacasManipular.vue'
import { listarProdutos, deletarProduto } from 'src/services/produtoService'
import type { QTableColumn } from 'quasar'

const $q = useQuasar()
const tab = ref('user')

const dialogEditarUsuario = ref(false)
const nome = ref<string | null>(null)
const sobrenome = ref<string | null>(null)
const email = ref<string | null>(null)
const telefone = ref<string | null>(null)
const senha = ref<string | null>(null)
const senhaVisivel = ref(true)

const abrirDialogEditarUsuario = () => { dialogEditarUsuario.value = true }
const editarUsuario = () => {
  $q.notify({ type: 'positive', message: 'Dados alterados com sucesso!' })
  dialogEditarUsuario.value = false
}

const dialogGravar = ref(false)
const dialogEditar = ref(false)
const produtoSelecionado = ref<Produto | null>(null)
const produtos = ref<Produto[]>([])

interface Produto {
  id: string
  nome: string
  descricao: string
  categoria: string
  preco: number
  estoque: number
  img?: string
}

const filtroNome = ref('')
const filtroCategoria = ref<string | null>(null)

const categorias = [
  { label: 'Todas', value: null },
  { label: 'Facas', value: 'facas' },
  { label: 'Estojos', value: 'estojos' },
  { label: 'Aventais', value: 'aventais' },
  { label: 'Churrascos', value: 'churrascos' }
]

const colunas: QTableColumn[] = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left' },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
  { name: 'categoria', label: 'Categoria', field: 'categoria', align: 'left' },
  { name: 'preco', label: 'Preço', field: 'preco', align: 'right' },
  { name: 'estoque', label: 'Estoque', field: 'estoque', align: 'right' },
  { name: 'acoes', label: '', field: 'acoes', align: 'center' }
]

const produtosFiltrados = computed(() => {
  return produtos.value.filter(p => {
    const nomeMatch = p.nome.toLowerCase().includes(filtroNome.value.toLowerCase())
    const categoriaMatch = !filtroCategoria.value || p.categoria === filtroCategoria.value
    return nomeMatch && categoriaMatch
  })
})

const listar = async () => {
  try {
    produtos.value = await listarProdutos()
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao carregar produtos' })
  }
}

const novoProduto = () => {
  produtoSelecionado.value = null
  dialogGravar.value = true
}

const abrirEditarProduto = (produto: Produto) => {
  produtoSelecionado.value = { ...produto }
  dialogEditar.value = true
}

const removerProduto = async (produto: Produto) => {
  if (confirm(`Deseja excluir o produto "${produto.nome}"?`)) {
    await deletarProduto(produto.id)
    await listar()
    $q.notify({ type: 'positive', message: 'Produto removido com sucesso!' })
  }
}

onMounted(listar)
</script>
