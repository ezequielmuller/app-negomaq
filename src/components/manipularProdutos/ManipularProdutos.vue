<template>
  <q-dialog v-model="dialogGravar" persistent>
    <q-card style="width: 400px; max-height: 50vh" class="column no-wrap">
      <q-card-section class="bg-primary text-white">
        <div class="row items-center" style="gap: 8px">
          <q-icon name="add" size="md" />
          <div class="text-h6">Adicionar Faca</div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-12">
            <q-input dense flat outlined v-model="form.nome" label="Nome do Produto" />
          </div>
          <div class="col-12">
            <q-input dense flat outlined v-model="form.descricao" label="Descrição" type="textarea" />
          </div>
          <div class="col-6">
            <q-input dense flat outlined v-model="form.preco" label="Preço do Produto" type="number" />
          </div>
          <div class="col-6">
            <q-select dense flat outlined v-model="form.categoria" :options="categorias" option-label="label"
              option-value="value" emit-value map-options label="Categoria" />
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

      <q-separator style="height: 3px;" class="bg-primary q-mr-md q-ml-md" />

      <q-card-actions align="right" class="q-mr-sm q-mb-xs">
        <q-btn outline label="Fechar" color="primary" v-close-popup />
        <q-btn label="Gravar" color="primary" @click="gravarProduto" icon="save" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="dialogEditar" persistent>
    <q-card style="width: 400px; max-height: 50vh" class="column no-wrap">
      <q-card-section class="bg-primary text-white">
        <div class="row items-center" style="gap: 8px">
          <q-icon name="edit_square" size="md" />
          <div class="text-h6">Alterar Faca</div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-12">
            <q-input dense flat outlined v-model="form.nome" label="Nome do Produto" />
          </div>
          <div class="col-12">
            <q-input dense flat outlined v-model="form.descricao" label="Descrição" type="textarea" />
          </div>
          <div class="col-6">
            <q-input dense flat outlined v-model="form.preco" label="Preço do Produto" type="number" />
          </div>
          <div class="col-6">
            <q-select dense flat outlined v-model="form.categoria" :options="categorias" option-label="label"
              option-value="value" emit-value map-options label="Categoria" />
          </div>

          <div class="col-12" v-if="imgUrl">
            <q-img :src="imgUrl" style="height: 120px; border-radius: 12px" />
          </div>

          <div class="col-12">
            <q-file v-model="form.imgArquivos" label="Nova imagem (opcional)" multiple accept="image/*" outlined flat
              dense>
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>
        </div>
      </q-card-section>

      <q-separator style="height: 3px;" class="bg-primary q-mr-md q-ml-md" />

      <q-card-actions align="right" class="q-mr-sm q-mb-xs">
        <q-btn outline label="Fechar" color="primary" v-close-popup />
        <q-btn label="Salvar" color="primary" @click="editarProduto" icon="save" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { criarProduto, atualizarProduto } from 'src/services/produtoService'
import type { Produto } from 'src/types/types'

type ArquivosImagem = File[] | null

const props = defineProps<{
  dialogGravar: boolean
  dialogEditar: boolean
  produto?: Produto | null
}>()

const emit = defineEmits(['update:dialogGravar', 'update:dialogEditar', 'atualizarLista'])

const dialogGravar = ref(props.dialogGravar)
const dialogEditar = ref(props.dialogEditar)
const produtoId = ref<string | null>(null)
const imgUrl = ref<string | null>(null)

const $q = useQuasar()

const form = ref<{
  nome: string
  descricao: string
  preco: number | string
  categoria: string
  estoque: number | string
  imgArquivos: ArquivosImagem
}>({
  nome: '',
  descricao: '',
  preco: 0,
  categoria: '',
  estoque: 0,
  imgArquivos: null
})

const categorias = [
  { label: 'Facas', value: 'facas' },
  { label: 'Estojos', value: 'estojos' },
  { label: 'Aventais', value: 'aventais' },
  { label: 'Churrascos', value: 'churrascos' }
]

watch(() => props.produto, (novo) => {
  if (novo) {
    form.value = {
      nome: novo.nome,
      descricao: novo.descricao,
      preco: novo.preco,
      categoria: novo.categoria,
      estoque: novo.estoque ?? 0,
      imgArquivos: null
    }
    produtoId.value = novo.id || null
    imgUrl.value = novo.img || null
  } else {
    form.value = { nome: '', descricao: '', preco: 0, categoria: '', estoque: 0, imgArquivos: null }
    produtoId.value = null
    imgUrl.value = null
  }
}, { immediate: true })

watch(() => props.dialogGravar, val => { dialogGravar.value = val })
watch(dialogGravar, val => { emit('update:dialogGravar', val) })
watch(() => props.dialogEditar, val => { dialogEditar.value = val })
watch(dialogEditar, val => { emit('update:dialogEditar', val) })

const gravarProduto = async () => {
  try {
    $q.loading.show({ message: 'Cadastrando Produto...' })
    const data = {
      nome: form.value.nome,
      descricao: form.value.descricao,
      preco: Number(form.value.preco),
      categoria: form.value.categoria,
      estoque: Number(form.value.estoque)
    }
    await criarProduto(data)
    $q.notify({ type: 'positive', message: 'Produto criado!' })
    emit('atualizarLista')
    dialogGravar.value = false
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao criar produto!' })
  } finally {
    $q.loading.hide()
  }
}

const editarProduto = async () => {
  try {
    if (!produtoId.value) throw new Error('ID do produto não definido')
    $q.loading.show({ message: 'Alterando Produto...' })
    const data = {
      nome: form.value.nome,
      descricao: form.value.descricao,
      preco: Number(form.value.preco),
      categoria: form.value.categoria,
      estoque: Number(form.value.estoque)
    }
    await atualizarProduto(produtoId.value, data)
    $q.notify({ type: 'positive', message: 'Produto atualizado!' })
    emit('atualizarLista')
    dialogEditar.value = false
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao editar produto!' })
  } finally {
    $q.loading.hide()
  }
}
</script>
