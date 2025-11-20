<template>
  <q-dialog v-model="dialogGravar" persistent>
    <q-card style="width: 400px; max-height: 70vh; border-radius: 20px;" class="column no-wrap">
      <q-card-section class="bg-primary text-white" style="flex-shrink: 0;">
        <div class="row items-center" style="gap: 8px">
          <q-icon name="add" size="md" />
          <div class="text-h6">Adicionar Produto</div>
        </div>
      </q-card-section>
      <q-card-section style="flex: 1; overflow-y: auto;">
        <div class="row q-col-gutter-sm">
          <div class="col-12">
            <q-input dense flat outlined v-model="form.nome" label="Nome do Produto" />
          </div>
          <div class="col-12">
            <q-input dense flat outlined v-model="form.descricao" label="Descrição" type="textarea" />
          </div>
          <div class="col-6">
            <q-input dense flat outlined v-model="form.preco" label="Preço do Produto" mask="#.###.###,##"
              reverse-fill-mask prefix="R$" />
          </div>
          <div class="col-6">
            <q-select dense flat outlined v-model="form.categoria" :options="categorias" option-label="label"
              option-value="value" emit-value map-options label="Categoria" />
          </div>
          <div class="col-12">
            <q-input dense flat outlined v-model="form.peso" label="Peso" type="number" />
          </div>
          <div class="col-12">
            <q-input dense flat outlined v-model="form.largura" label="Largura" type="number" />
          </div>
          <div class="col-12">
            <q-input dense flat outlined v-model="form.altura" label="Altura" type="number" />
          </div>
          <div class="col-12">
            <q-input dense flat outlined v-model="form.comprimento" label="Comprimento" type="number" />
          </div>
          <div class="col-12">
            <q-file v-model="form.imgArquivos" label="Imagem" multiple accept="image/*" outlined flat dense>
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>
        </div>
      </q-card-section>
      <q-separator style="height: 3px; flex-shrink: 0;" class="bg-primary q-mr-md q-ml-md" />
      <q-card-actions align="right" class="q-mr-sm q-mb-xs" style="flex-shrink: 0;">
        <q-btn outline label="Fechar" color="primary" v-close-popup icon="close" class="hover-scale"
          style="border-radius: 20px;" />
        <q-btn label="Gravar" color="primary" @click="gravarProduto" icon="save" class="hover-scale"
          style="border-radius: 20px;" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="dialogEditar" persistent>
    <q-card style="width: 400px; max-height: 70vh; border-radius: 20px;" class="column no-wrap">
      <q-card-section class="bg-amber-9 text-white" style="flex-shrink: 0;">
        <div class="row items-center" style="gap: 8px">
          <q-icon name="edit_square" size="md" />
          <div class="text-h6">Alterar Produto</div>
        </div>
      </q-card-section>
      <q-card-section style="flex: 1; overflow-y: auto;">
        <div class="row q-col-gutter-sm">
          <div class="col-12">
            <q-input dense flat outlined v-model="form.nome" label="Nome do Produto" />
          </div>
          <div class="col-12">
            <q-input dense flat outlined v-model="form.descricao" label="Descrição" type="textarea" />
          </div>
          <div class="col-6">
            <q-input dense flat outlined v-model="form.preco" label="Preço do Produto" mask="#.###.###,##"
              reverse-fill-mask prefix="R$" />
          </div>
          <div class="col-6">
            <q-select dense flat outlined v-model="form.categoria" :options="categorias" option-label="label"
              option-value="value" emit-value map-options label="Categoria" />
          </div>
          <div class="col-12">
            <q-input dense flat outlined v-model="form.peso" label="Peso" type="number" />
          </div>
          <div class="col-12">
            <q-input dense flat outlined v-model="form.largura" label="Largura" type="number" />
          </div>
          <div class="col-12">
            <q-input dense flat outlined v-model="form.altura" label="Altura" type="number" />
          </div>
          <div class="col-12">
            <q-input dense flat outlined v-model="form.comprimento" label="Comprimento" type="number" />
          </div>
          <div class="col-12">
            <q-file v-model="form.imgArquivos" label="Nova imagem (opcional)" multiple accept="image/*" outlined flat
              dense>
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>
          <div class="col-12" v-if="imgUrl">
            <q-img :src="imgUrl" style="max-width: 100%; height: auto;" />
          </div>
        </div>
      </q-card-section>
      <q-separator style="height: 3px; flex-shrink: 0;" class="bg-amber-9 q-mr-md q-ml-md" />
      <q-card-actions align="right" class="q-mr-sm q-mb-xs" style="flex-shrink: 0;">
        <q-btn outline label="Fechar" color="amber-9" v-close-popup icon="close" style="border-radius: 20px;"
          class="hover-scale" />
        <q-btn label="Salvar" color="amber-9" @click="editarProduto" icon="save" style="border-radius: 20px;"
          class="hover-scale" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="dialogExcluir" persistent>
    <q-card style="width: 400px; max-height: 50vh; border-radius: 20px;" class="column no-wrap">
      <q-card-section class="bg-primary text-white" style="flex-shrink: 0;">
        <div class="row items-center" style="gap: 8px">
          <q-icon name="warning" size="md" />
          <div class="text-h6 text-bold"> - ATENÇÃO </div>
        </div>
      </q-card-section>
      <q-card-section style="flex: 1;">
        <div style="font-size: 16px;" class="text-center">
          Você deseja excluir o produto "
          <strong>{{ produto?.nome }}</strong>"?
        </div>
      </q-card-section>
      <q-separator style="height: 3px; flex-shrink: 0;" class="bg-primary q-mr-md q-ml-md" />
      <q-card-actions align="right" class="q-mr-sm q-mb-xs" style="flex-shrink: 0;">
        <q-btn outline label="Fechar" color="primary" v-close-popup icon="close" style="border-radius: 20px;"
          class="hover-scale" />
        <q-btn label="Excluir" color="primary" @click="excluirProduto" icon="delete" style="border-radius: 20px;"
          class="hover-scale" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="dialogEstoque" persistent>
    <q-card style="width: 400px; max-height: 50vh; border-radius: 20px;" class="column no-wrap">
      <q-card-section class="bg-blue-9 text-white" style="flex-shrink: 0;">
        <div class="row items-center" style="gap: 8px">
          <q-icon name="shelves" size="md" />
          <div class="text-h6 text-bold">Atualizar Estoque</div>
        </div>
      </q-card-section>
      <q-card-section style="flex: 1;">
        <div style="font-size: 16px;" class="row justify-center text-center q-mb-md">
          Escreva a &nbsp;<strong>QUANTIDADE ATUAL</strong>&nbsp; presente no estoque
        </div>
        <div class="col-12">
          <q-input v-model="form.estoque" dense outlined type="number" label="Quantidade Atual" />
        </div>
      </q-card-section>
      <q-separator style="height: 3px; flex-shrink: 0;" class="bg-blue-9 q-mr-md q-ml-md" />
      <q-card-actions align="right" class="q-mr-sm q-mb-xs" style="flex-shrink: 0;">
        <q-btn outline label="Fechar" color="blue-9" v-close-popup icon="close" style="border-radius: 20px;"
          class="hover-scale" />
        <q-btn label="Salvar" color="blue-9" @click="atualizarEstoqueProduto" icon="save" style="border-radius: 20px;"
          class="hover-scale" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="dialogPromocao" persistent>
    <q-card style="width: 400px; max-height: 50vh; border-radius: 20px;" class="column no-wrap">
      <q-card-section class="bg-green text-white" style="flex-shrink: 0;">
        <div class="row items-center" style="gap: 8px">
          <q-icon name="sell" size="md" />
          <div class="text-h6 text-bold">Promoção</div>
        </div>
      </q-card-section>
      <q-card-section style="flex: 1;"></q-card-section>
      <q-separator style="height: 3px; flex-shrink: 0;" class="bg-green q-mr-md q-ml-md" />
      <q-card-actions align="right" class="q-mr-sm q-mb-xs" style="flex-shrink: 0;">
        <q-btn outline label="Fechar" color="green" v-close-popup icon="close" style="border-radius: 20px;"
          class="hover-scale" />
        <q-btn label="Salvar" color="green" v-close-popup icon="save" style="border-radius: 20px;"
          class="hover-scale" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { criarProduto, atualizarProduto, deletarProduto, atualizarEstoque } from 'src/services/produtoServices'
import type { Produto } from 'src/types/types'
// Utils ---
type ArquivosImagem = File[] | null
const $q = useQuasar()
const props = defineProps<{
  dialogGravar: boolean
  dialogEditar: boolean
  dialogExcluir: boolean
  dialogEstoque: boolean
  dialogPromocao: boolean
  produto?: Produto | null
}>()
const emit = defineEmits(['update:dialogGravar', 'update:dialogEditar', 'update:dialogExcluir', 'update:dialogEstoque', 'update:dialogPromocao', 'atualizarLista'])
// Refs ----
const dialogGravar = ref(props.dialogGravar)
const dialogEditar = ref(props.dialogEditar)
const dialogExcluir = ref(props.dialogExcluir)
const dialogEstoque = ref(props.dialogEstoque)
const dialogPromocao = ref(props.dialogPromocao)
const produtoId = ref<string | null>(null)
const imgUrl = ref<string | null>(null)
const form = ref<{
  nome: string
  descricao: string
  preco: number
  categoria: string
  estoque: number
  peso: number
  largura: number
  altura: number
  comprimento: number
  imgArquivos: ArquivosImagem
}>({
  nome: '',
  descricao: '',
  preco: 0,
  categoria: '',
  estoque: 0,
  peso: 0,
  largura: 0,
  altura: 0,
  comprimento: 0,
  imgArquivos: null
})
const categorias = [
  { label: 'Facas', value: 'facas' },
  { label: 'Estojos', value: 'estojos' },
  { label: 'Aventais', value: 'aventais' },
  { label: 'Churrascos', value: 'churrascos' }
]

// Watch ---
watch(() => props.produto, (novo) => {
  if (novo) {
    form.value = {
      nome: novo.nome,
      descricao: novo.descricao,
      preco: novo.preco,
      categoria: novo.categoria,
      estoque: novo.estoque ?? 0,
      peso: novo.peso,
      largura: novo.largura,
      altura: novo.altura,
      comprimento: novo.comprimento,
      imgArquivos: null
    }
    produtoId.value = novo.id || null
    imgUrl.value = novo.img || null
  } else {
    form.value = { nome: '', descricao: '', preco: 0, categoria: '', estoque: 0, peso: 0, largura: 0, altura: 0, comprimento: 0, imgArquivos: null }
    produtoId.value = null
    imgUrl.value = null
  }
}, { immediate: true })

watch(() => props.dialogGravar, val => { dialogGravar.value = val })
watch(dialogGravar, val => { emit('update:dialogGravar', val) })

watch(() => props.dialogEditar, val => { dialogEditar.value = val })
watch(dialogEditar, val => { emit('update:dialogEditar', val) })

watch(() => props.dialogExcluir, val => { dialogExcluir.value = val })
watch(dialogExcluir, val => { emit('update:dialogExcluir', val) })

watch(() => props.dialogEstoque, val => { dialogEstoque.value = val })
watch(dialogEstoque, val => { emit('update:dialogEstoque', val) })

watch(() => props.dialogPromocao, val => { dialogPromocao.value = val })
watch(dialogPromocao, val => { emit('update:dialogPromocao', val) })

// Methods ---
const gravarProduto = async () => {
  if (!form.value.nome || !form.value.descricao || !form.value.preco ||
    !form.value.categoria || !form.value.peso || !form.value.largura ||
    !form.value.altura || !form.value.comprimento) {
    return $q.notify({
      type: "warning",
      message: "Campos não preenchidos!",
      position: "bottom",
      timeout: 1500
    })
  }
  try {
    $q.loading.show({ message: "Cadastrando Produto..." })
    const data = {
      nome: form.value.nome,
      descricao: form.value.descricao,
      preco: formatarPreco(form.value.preco),
      categoria: form.value.categoria,
      estoque: Number(form.value.estoque),
      peso: Number(form.value.peso),
      largura: Math.round(form.value.largura),
      altura: Math.round(form.value.altura),
      comprimento: Math.round(form.value.comprimento),
    }
    const result = await criarProduto(data)
    if (!result) return

    emit("atualizarLista")
    dialogGravar.value = false
    $q.notify({
      type: "positive",
      message: "Produto Gravado com Sucesso!",
      position: "bottom",
      timeout: 1500
    })
  } finally {
    $q.loading.hide()
  }
}

const editarProduto = async () => {
  if (!produtoId.value ||
    !form.value.nome ||
    !form.value.descricao ||
    !form.value.preco ||
    !form.value.categoria ||
    !form.value.peso ||
    !form.value.largura ||
    !form.value.altura ||
    !form.value.comprimento
  ) {
    return $q.notify({
      type: "warning",
      message: "Campos não preenchidos!",
      position: "bottom",
      timeout: 1500
    })
  }
  try {
    $q.loading.show({ message: "Alterando Produto..." })
    const data = {
      nome: form.value.nome,
      descricao: form.value.descricao,
      preco: formatarPreco(form.value.preco),
      categoria: form.value.categoria,
      estoque: Number(form.value.estoque),
      peso: Number(form.value.peso),
      largura: Math.round(form.value.largura),
      altura: Math.round(form.value.altura),
      comprimento: Math.round(form.value.comprimento),
    };
    const result = await atualizarProduto(produtoId.value, data);
    if (!result) return
    emit("atualizarLista")
    dialogEditar.value = false
    $q.notify({
      type: "positive",
      message: "Produto Editado com Sucesso!",
      position: "bottom",
      timeout: 1500
    });
  } finally {
    $q.loading.hide()
  }
}

const excluirProduto = async () => {
  if (!produtoId.value) {
    return $q.notify({
      type: "warning",
      message: "Produto não encontrado!",
      position: "bottom",
      timeout: 1500
    })
  }
  try {
    $q.loading.show({ message: "Deletando Produto..." })
    const result = await deletarProduto(produtoId.value)
    if (!result) return
    emit("atualizarLista")
    dialogExcluir.value = false
    $q.notify({
      type: "positive",
      message: "Produto deletado!",
      position: "bottom",
      timeout: 1500
    })
  } finally {
    $q.loading.hide()
  }
}

const atualizarEstoqueProduto = async () => {
  if (!produtoId.value) {
    return $q.notify({
      type: "warning",
      message: "Produto não encontrado!",
      position: "bottom",
      timeout: 1500
    })
  }
  try {
    $q.loading.show({ message: "Atualizando Estoque..." })
    const qtd = Number(form.value.estoque)
    const result = await atualizarEstoque(produtoId.value, qtd)
    if (!result) return
    emit("atualizarLista")
    dialogEstoque.value = false
    $q.notify({
      type: "positive",
      message: "Estoque atualizado!",
      position: "bottom",
      timeout: 1500
    })
  } finally {
    $q.loading.hide()
  }
}

// Metodos uteis ---
const formatarPreco = (valor: string | number): number => {
  if (typeof valor === 'string') {
    // remove pontos de milhar e troca vírgula por ponto
    const convertido = parseFloat(valor.replace(/\./g, '').replace(',', '.'))
    return Number(convertido.toFixed(2))
  }
  return Number(valor.toFixed(2))
}

// Mounted
onMounted(() => {
  console.log('Tela carregada!')
})
</script>
