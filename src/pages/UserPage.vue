<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="text-h5 text-bold q-ml-sm q-mt-sm">Painel do Usuário</div>
    </div>

    <q-separator class="q-mb-md" />

    <q-card class="q-pa-md q-mb-md shadow-2" style="border-radius: 20px; border: 0.7mm solid var(--q-primary);">
      <div class="column items-center q-gutter-md">
        <q-avatar size="60px" color="primary" text-color="white" icon="person" />

        <div class="text-h6">{{ user?.nome == '' ? 'Sem nome' : user?.nome }}</div>
        <div class="text-subtitle2 text-grey">{{ user?.email == '' ? 'Sem email' : user?.email }}</div>
        <div class="text-subtitle2 text-grey">{{ user?.telefone == '' ? 'Sem telefone' : user?.telefone }}</div>

        <!-- <q-input dense outlined readonly size="xs" class="full-width" label="Senha" v-model="senhaExemplo"
          :type="ocultarSenha ? 'password' : 'text'">
          <template #append>
            <q-icon :name="ocultarSenha ? 'visibility_off' : 'visibility'" class="cursor-pointer"
              @click="ocultarSenha = !ocultarSenha" />
          </template>
</q-input> -->

        <div class="row justify-center q-mt-sm">
          <q-btn color="primary" icon="edit" label="Editar Perfil" @click="abrirDialogEditarUsuario"
            style="border-radius: 20px;" class="hover-scale" />
          <q-btn outline color="primary" icon="logout" label="Sair" @click="sairSistema()" style="border-radius: 20px;"
            class="q-ml-sm hover-scale" />
        </div>
      </div>
    </q-card>


    <div v-if="admin == false">
      <div class="text-h6 row q-mb-xs">Lista de Produtos</div>

      <div class="row q-col-gutter-sm">
        <div class="col-md-4 col-sm-4 col-xs-12">
          <q-input v-model="filtroNome" label="Pesquisar por nome" dense outlined debounce="300" />
        </div>
        <div class="col-md-4 col-sm-4 col-xs-12">
          <q-select v-model="filtroCategoria" :options="categorias" label="Filtrar por categoria" dense outlined
            emit-value map-options />
        </div>
        <div class="row justify-end col-md-4 col-sm-4 col-xs-12">
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
              <q-td key="actions" :props="props">
                <q-btn flat round dense icon="sell" color="green" @click="abrirPromocaoProduto(props.row)">
                  <q-tooltip>
                    Adicionar Promoção
                  </q-tooltip>
                </q-btn>
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

    </div>

    <ManipularProdutos v-model:dialogGravar="dialogGravar" v-model:dialogEditar="dialogEditar"
      v-model:dialog-promocao="dialogPromocao" v-model:dialogEstoque="dialogEstoque"
      v-model:dialog-excluir="dialogExcluir" :produto="produtoSelecionado" @atualizarLista="listarProdutosTela" />

    <!-- ===== Dialog Editar Usuário ===== -->
    <q-dialog v-model="dialogEditarUsuario" persistent>
      <q-card style="width: 400px; max-height: 50vh; border-radius: 20px;" class="column no-wrap">
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
          <q-btn icon="close" outline label="Fechar" class="hover-scale" color="primary" v-close-popup
            style="border-radius: 20px;" />
          <q-btn icon="save" label="Salvar" color="primary" class="hover-scale" @click="editarUsuario"
            style="border-radius: 20px;" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, } from 'vue'
import { useQuasar } from 'quasar'
import ManipularProdutos from 'src/components/ManipularProdutos.vue'
import { listarProdutos } from 'src/services/produtoService'
import type { Produto } from '../types/types'
import type { QTableProps } from 'quasar'
import { useRouter } from "vue-router";
import { formatPrice } from 'src/config/formatPrice'
import { useAuth } from 'src/composables/useAuth'

// Importaçãoes =====
const $q = useQuasar()
const router = useRouter();
const { getUser, removeUser } = useAuth()
const user = getUser()

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
const dialogExcluir = ref(false)
const dialogEstoque = ref(false)
const dialogPromocao = ref(false)

const produtoSelecionado = ref<Produto | null>(null)
const produtos = ref<Produto[]>([])
const filtroNome = ref('')
const filtroCategoria = ref<string | null>(null)

// const ocultarSenha = ref(true)
// const senhaExemplo = ref('negomaq123')
const admin = ref(false)

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

const abrirDeletarProduto = (produto: Produto) => {
  produtoSelecionado.value = { ...produto }
  dialogExcluir.value = true
}

const abrirEstoqueProduto = (produto: Produto) => {
  produtoSelecionado.value = { ...produto }
  dialogEstoque.value = true
}

const abrirPromocaoProduto = (produto: Produto) => {
  produtoSelecionado.value = { ...produto }
  dialogPromocao.value = true
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

const sairSistema = async () => {
  try {
    $q.loading.show({ message: 'Saindo do Sistema...' })
    await router.push('/home')
    removeUser()
    window.location.reload();
    $q.loading.hide()
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: 'Não foi possivel sair do sistema!',
      timeout: 1500,
      position: 'bottom'
    })
  } finally {
    $q.loading.hide()
  }
}

function formatCurrency(value: number) {
  return formatPrice(value)
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
