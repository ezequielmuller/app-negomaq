<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="text-h5 text-bold q-ml-sm">Painel do Usuário</div>
    </div>

    <q-separator class="q-mb-md" />

    <q-card class="q-pa-md q-mb-md shadow-2 " style="border-radius: 8px; border: 1px dashed var(--q-primary);">
      <div class="row q-col-gutter-sm items-center">
        <div class="col-12 col-md-12 col-sm-12 col-xs-12 row justify-center">
          <q-avatar size="60px" color="primary" text-color="white" icon="person" />
        </div>
        <div class="col-12 col-md-12 col-sm-12 col-xs-12 row justify-center">
          <div class="column q-ml-md">
            <div class="text-h6">Ezequiel H. G. Muller</div>
          </div>
        </div>
        <div class="col-12 col-md-12 col-sm-12 col-xs-12 row justify-center">
          <div class="column q-ml-md">
            <div class="text-subtitle2 text-grey">zikimuller017@gmail.com</div>
          </div>
        </div>
        <div class="col-12 col-md-12 col-sm-12 col-xs-12 row justify-center">
          <div class="column q-ml-md">
            <div class="text-subtitle2 text-grey">(54) 9 9922-8928</div>
          </div>
        </div>
        <div class="col-12 col-md-12 col-sm-12 col-xs-12 row justify-center">
          <div class="column q-ml-md q-pa-sm">
            <q-input dense outlined readonly size="xs" class="full-width" label="Senha" v-model="senhaExemplo"
              :type="ocultarSenha ? 'password' : 'text'">
              <template #append>
                <q-icon :name="ocultarSenha ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="ocultarSenha = !ocultarSenha" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="col-12 col-md-12 col-xs-12 col-sm-12 flex justify-center q-mt-sm q-mt-md-none">
          <q-btn color="primary" icon="edit" label="Editar Perfil" @click="abrirDialogEditarUsuario"
            style="border-radius: 8px;" />
        </div>
      </div>
    </q-card>

    <div class="col-12 q-mt-md">
      <div class="text-h6 q-mb-md">Lista de Produtos</div>

      <q-input v-model="filtroNome" label="Pesquisar por nome" dense outlined class="q-mb-sm" debounce="300" />
      <q-select v-model="filtroCategoria" :options="categorias" label="Filtrar por categoria" dense outlined emit-value
        map-options class="q-mb-md" />

      <q-table dense :rows="produtosFiltrados" :columns="columns" row-key="id" no-data-label="Sem Produtos"
        separator="cell" :rows-per-page-options="[0]" virtual-scroll class="q-mt-md tabela-full-width"
        style="height: 450px">
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="nome" :props="props">
              {{ props.row.nome ?? '#' }}
            </q-td>
            <q-td key="descricao" :props="props">
              {{ props.row.descricao ?? "#" }}
            </q-td>
            <q-td key="preco" :props="props">
              {{ props.row.preco }}
            </q-td>
            <q-td key="categoria" :props="props">
              {{ props.row.categoria.toUpperCase() }}
            </q-td>
            <q-td key="estoque" :props="props">
              {{ props.row.estoque }}
            </q-td>
            <q-td key="actions" :props="props">
              <q-btn flat round dense icon="edit" color="primary" @click="abrirEditarProduto(props.row)" />
              <q-btn flat round dense icon="delete" color="negative" @click="removerProduto(props.row)" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <q-btn color="primary" icon="add" label="Adicionar Produto" class="q-mt-md" @click="novoProduto" />

    <ManipularProdutos v-model:dialogGravar="dialogGravar" v-model:dialogEditar="dialogEditar"
      :produto="produtoSelecionado" @atualizarLista="listarProdutosTela" />

    <!-- ===== Dialog Editar Usuário ===== -->
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
import ManipularProdutos from 'src/components/manipularProdutos/ManipularProdutos.vue'
import { listarProdutos, deletarProduto } from 'src/services/produtoService'
import type { Produto } from '../types/types'
import type { QTableProps } from 'quasar'

// Importaçãoes =====
const $q = useQuasar()

// Variaveis  =====
const dialogEditarUsuario = ref(false)
const nome = ref('')
const sobrenome = ref('')
const email = ref('')
const telefone = ref('')
const senha = ref('')
const senhaVisivel = ref(true)

const dialogGravar = ref(false)
const dialogEditar = ref(false)

const produtoSelecionado = ref<Produto | null>(null)
const produtos = ref<Produto[]>([])
const filtroNome = ref('')
const filtroCategoria = ref<string | null>(null)

const ocultarSenha = ref(true)
const senhaExemplo = ref('negomaq123')

const categorias = [
  { label: 'Todas', value: null },
  { label: 'Facas', value: 'facas' },
  { label: 'Estojos', value: 'estojos' },
  { label: 'Aventais', value: 'aventais' },
  { label: 'Churrascos', value: 'churrascos' }
]

const columns: QTableProps['columns'] = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left' },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
  { name: 'preco', label: 'Preço', field: 'preco', align: 'right' },
  { name: 'categoria', label: 'Categoria', field: 'categoria', align: 'left' },
  { name: 'estoque', label: 'Estoque', field: 'estoque', align: 'right' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' }
]

// Metodos =====
const abrirDialogEditarUsuario = () => {
  dialogEditarUsuario.value = true
}

const novoProduto = () => {
  produtoSelecionado.value = null
  dialogGravar.value = true
}

const abrirEditarProduto = (produto: Produto) => {
  produtoSelecionado.value = { ...produto }
  dialogEditar.value = true
}

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

const removerProduto = async (produto: Produto) => {
  try {
    $q.loading.show({ message: 'Removendo Produto...' })
    await deletarProduto(produto.id)
    await listarProdutos()
    $q.loading.hide()
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: 'Não foi possivel remover o produto do estoque!',
      timeout: 1500,
      position: 'bottom'
    })
  } finally {
    $q.loading.hide()
  }
}

const editarUsuario = () => {
  try {
    $q.loading.show({ message: 'Editando Perfil...' })
    const data = {
      nome: nome.value,
      sobrenome: sobrenome.value,
      email: email.value,
      telefone: telefone.value,
      senha: senha.value
    }
    console.log(data)
    // await EditarUsuario(data)
    $q.loading.hide()
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: 'Não foi possivel editar o perfil!',
      timeout: 1500,
      position: 'bottom'
    })
  } finally {
    $q.loading.hide()
  }
}

// Computed =====
const produtosFiltrados = computed(() => {
  return produtos.value.filter(p => {
    const nomeMatch = p.nome.toLowerCase().includes(filtroNome.value.toLowerCase())
    const categoriaMatch = !filtroCategoria.value || p.categoria === filtroCategoria.value
    return nomeMatch && categoriaMatch
  })
})

// Mounted =====
onMounted(() => {
  console.log('Tela carregada')
  void listarProdutosTela()
})
</script>
