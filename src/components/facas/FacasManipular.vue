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
                        <q-input dense flat outlined v-model="nome" label="Nome do Produto" />
                    </div>
                    <div class="col-12">
                        <q-input dense flat outlined v-model="descricao" label="Descrição" type="textarea" />
                    </div>
                    <div class="col-6">
                        <q-input dense flat outlined v-model="preco" label="Preço do Produto" />
                    </div>
                    <div class="col-6">
                        <q-select dense flat outlined v-model="categoria" :options="categorias" option-label="label"
                            option-value="value" emit-value map-options />

                    </div>
                    <div class="col-12">
                        <q-file v-model="img" label="Imagem" multiple accept="image/*" outlined flat dense>
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
                <q-btn label="Gravar" color="primary" @click="gravarFaca" icon="save" />
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
                        <q-input dense flat outlined v-model="nomeEditado" label="Nome do Produto" />
                    </div>
                    <div class="col-12">
                        <q-input dense flat outlined v-model="descricaoEditado" label="Descrição" type="textarea" />
                    </div>
                    <div class="col-6">
                        <q-input dense flat outlined v-model="precoEditado" label="Preço do Produto" />
                    </div>
                    <div class="col-6">
                        <q-select dense flat outlined v-model="categoriaEditado" :options="categorias"
                            option-label="label" option-value="value" />
                    </div>
                    <div class="col-12">
                        <q-file v-model="imgEditado" label="Imagem" multiple accept="image/*" outlined flat dense>
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
                <q-btn label="Gravar" color="primary" @click="editarFaca" icon="save" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { criarProduto, atualizarProduto } from 'src/services/produtoService'

const props = defineProps<{ dialogGravar: boolean, dialogEditar: boolean }>()
const emit = defineEmits(['update:dialogGravar', 'update:dialogEditar'])


const dialogGravar = ref(props.dialogGravar)
const dialogEditar = ref(props.dialogEditar)
const $q = useQuasar()

watch(() => props.dialogGravar, val => {
    dialogGravar.value = val
})
watch(dialogGravar, val => {
    emit('update:dialogGravar', val)
})
watch(() => props.dialogEditar, val => {
    dialogEditar.value = val
})
watch(dialogEditar, val => {
    emit('update:dialogEditar', val)
})


const nome = ref('')
const descricao = ref('')
const preco = ref('')
const categoria = ref('')
const img = ref(null)

const nomeEditado = ref('')
const descricaoEditado = ref('')
const precoEditado = ref('')
const categoriaEditado = ref('')
const imgEditado = ref(null)
const produtoId = ref<number | null>(null)

const categorias = [
    { label: 'Facas', value: 'facas' },
    { label: 'Estojos', value: 'estojos' },
    { label: 'Aventais', value: 'aventais' },
    { label: 'Churrascos', value: 'churrascos' }
]

const gravarFaca = async () => {
    try {
        $q.loading.show({ message: 'Cadastrando Produto...' })
        const data = { nome: nome.value, descricao: descricao.value, preco: Number(preco.value), categoria: categoria.value }
        await criarProduto(data)
        $q.notify({ type: 'positive', message: 'Produto criado!' })
        dialogGravar.value = false
    } catch {
        $q.notify({ type: 'negative', message: 'Erro ao editar produto!' })
    } finally {
        $q.loading.hide()
    }
}

const editarFaca = async () => {
    try {
        $q.loading.show({ message: 'Alterando Produto...' })
        const data = { nome: nomeEditado.value, descricao: descricaoEditado.value, preco: Number(precoEditado.value), categoria: categoriaEditado.value }
        if (produtoId.value !== null) {
            await atualizarProduto(String(produtoId.value), data)
        } else {
            throw new Error('ID do produto não definido')
        }
        $q.notify({ type: 'positive', message: 'Produto atualizado!' })
        dialogEditar.value = false
    } catch {
        $q.notify({ type: 'negative', message: 'Erro ao editar produto!' })
    } finally {
        $q.loading.hide()
    }
}

</script>