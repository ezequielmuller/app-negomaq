<template>
  <!-- Dialog Lista de Endereços -->
  <q-dialog v-model="dialogListaEnderecos" persistent>
    <q-card style="width: 650px; max-height: 75vh; border-radius: 20px;" class="column no-wrap">
      <q-card-section class="bg-teal text-white" style="position: sticky; top: 0; z-index: 1;">
        <div class="row items-center justify-between">
          <div class="row items-center" style="gap: 8px">
            <q-icon name="home" size="md" />
            <div class="text-h6">Meus Endereços</div>
          </div>
          <q-btn icon="add" flat round color="white" @click="abrirDialogAdicionar">
            <q-tooltip>Adicionar Endereço</q-tooltip>
          </q-btn>
        </div>
      </q-card-section>
      <q-card-section class="scroll" style="flex: 1; overflow-y: auto;">
        <div v-if="enderecos.length === 0" class="text-center q-pa-lg text-grey-6">
          <q-icon name="location_off" size="64px" />
          <div class="text-subtitle1 q-mt-sm">Nenhum endereço cadastrado</div>
          <div class="text-caption">Clique no botão + para adicionar</div>
        </div>
        <div v-else class="q-gutter-md">
          <q-card v-for="(endereco, index) in enderecos" :key="endereco.id || `endereco-${index}`" bordered
            class="q-pa-md hover-card" style="border-radius: 12px; transition: all 0.3s;">
            <div class="row items-start">
              <div class="col">
                <div class="row items-center q-mb-xs">
                  <q-icon name="location_on" color="teal" size="20px" class="q-mr-xs" />
                  <div class="text-subtitle1 text-bold">
                    {{ endereco.logradouro }}, {{ endereco.numero }}
                  </div>
                </div>
                <div class="text-body2 text-grey-7 q-ml-md">
                  <div v-if="endereco.complemento">{{ endereco.complemento }}</div>
                  <div>{{ endereco.bairro }}</div>
                  <div>{{ endereco.cidade }} - {{ endereco.estado }}</div>
                  <div class="text-caption text-grey-6 q-mt-xs">
                    CEP: {{ formatarCEP(endereco.cep) }}
                  </div>
                </div>
              </div>
              <div class="col-auto row q-gutter-xs">
                <q-btn icon="edit" flat round color="amber-9" size="sm" @click="abrirDialogEditar(endereco)"
                  class="hover-scale">
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn icon="delete" flat round color="negative" size="sm" @click="abrirDialogExcluir(endereco)"
                  class="hover-scale">
                  <q-tooltip>Excluir</q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card>
        </div>
      </q-card-section>
      <q-separator style="height: 2px;" class="bg-teal q-mr-md q-ml-md" />
      <q-card-actions align="right" class="q-mr-sm q-mb-xs">
        <q-btn outline label="Fechar" color="teal" v-close-popup icon="close" class="hover-scale"
          style="border-radius: 20px;" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Dialog Gravar -->
  <q-dialog v-model="dialogGravar" persistent>
    <q-card style="width: 550px; max-height: 75vh; border-radius: 20px;" class="column no-wrap">
      <q-card-section class="bg-teal text-white">
        <div class="row items-center" style="gap: 8px">
          <q-icon name="add_location" size="md" />
          <div class="text-h6">Adicionar Endereço</div>
        </div>
      </q-card-section>
      <q-card-section class="scroll" style="flex: 1; overflow-y: auto;">
        <div class="row q-col-gutter-sm">
          <div class="col-12">
            <q-input dense flat outlined v-model="form.cep" label="CEP" mask="#####-###" />
          </div>
          <div class="col-12">
            <q-input dense flat outlined v-model="form.logradouro" label="Logradouro" />
          </div>
          <div class="col-5">
            <q-input dense flat outlined v-model="form.numero" label="Número" />
          </div>
          <div class="col-7">
            <q-input dense flat outlined v-model="form.complemento" label="Complemento" />
          </div>
          <div class="col-12">
            <q-input dense flat outlined v-model="form.bairro" label="Bairro" />
          </div>
          <div class="col-8">
            <q-input dense flat outlined v-model="form.cidade" label="Cidade" />
          </div>
          <div class="col-4">
            <q-select dense flat outlined v-model="form.estado" :options="estadosBrasileiros" option-label="label"
              option-value="value" emit-value map-options label="UF" />
          </div>
        </div>
      </q-card-section>
      <q-separator style="height: 2px;" class="bg-teal q-mr-md q-ml-md" />
      <q-card-actions align="right" class="q-mr-sm q-mb-xs">
        <q-btn flat label="Cancelar" color="grey-7" @click="fecharDialogGravar" class="hover-scale"
          style="border-radius: 20px;" />
        <q-btn label="Gravar" color="teal" @click="gravarEndereco" icon="save" class="hover-scale"
          style="border-radius: 20px;" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Dialog Editar -->
  <q-dialog v-model="dialogEditar" persistent>
    <q-card style="width: 550px; max-height: 75vh; border-radius: 20px;" class="column no-wrap">
      <q-card-section class="bg-amber-9 text-white" style="position: sticky; top: 0; z-index: 1;">
        <div class="row items-center" style="gap: 8px">
          <q-icon name="edit_location" size="md" />
          <div class="text-h6">Alterar Endereço</div>
        </div>
      </q-card-section>
      <q-card-section class="scroll" style="flex: 1; overflow-y: auto;">
        <div class="row q-col-gutter-sm">
          <div class="col-12">
            <q-input dense flat outlined v-model="form.cep" label="CEP" mask="#####-###" />
          </div>
          <div class="col-12">
            <q-input dense flat outlined v-model="form.logradouro" label="Logradouro" />
          </div>
          <div class="col-5">
            <q-input dense flat outlined v-model="form.numero" label="Número" />
          </div>
          <div class="col-7">
            <q-input dense flat outlined v-model="form.complemento" label="Complemento" />
          </div>
          <div class="col-12">
            <q-input dense flat outlined v-model="form.bairro" label="Bairro" />
          </div>
          <div class="col-8">
            <q-input dense flat outlined v-model="form.cidade" label="Cidade" />
          </div>
          <div class="col-4">
            <q-select dense flat outlined v-model="form.estado" :options="estadosBrasileiros" option-label="label"
              option-value="value" emit-value map-options label="UF"></q-select>
          </div>
        </div>
      </q-card-section>
      <q-separator style="height: 2px;" class="bg-amber-9 q-mr-md q-ml-md" />
      <q-card-actions align="right" class="q-mr-sm q-mb-xs bg-white" style="position: sticky; bottom: 0; z-index: 1;">
        <q-btn flat label="Cancelar" color="grey-7" @click="fecharDialogEditar" style="border-radius: 20px;"
          class="hover-scale" />
        <q-btn label="Salvar" color="amber-9" @click="editarEndereco" icon="save" style="border-radius: 20px;"
          class="hover-scale" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Dialog Excluir -->
  <q-dialog v-model="dialogExcluir" persistent>
    <q-card style="width: 450px; max-height: 55vh; border-radius: 20px;" class="column no-wrap">
      <q-card-section class="bg-negative text-white">
        <div class="row items-center" style="gap: 8px">
          <q-icon name="warning" size="md" />
          <div class="text-h6 text-bold">Atenção</div>
        </div>
      </q-card-section>
      <q-card-section>
        <div style="font-size: 16px;" class="text-center q-pa-">
          <q-icon name="delete_forever" size="48px" color="negative" />
          <div>Você deseja realmente excluir o endereço?</div>
          <div class="q-mt-md text-bold">
            {{ enderecoSelecionado?.logradouro }}, {{ enderecoSelecionado?.numero }}
          </div>
          <div class="text-caption text-grey-7 q-mt-xs">
            {{ enderecoSelecionado?.bairro }} - {{ enderecoSelecionado?.cidade }}/{{ enderecoSelecionado?.estado }}
          </div>
          <div class="text-caption text-negative text-bold q-mt-md">
            Esta ação não pode ser desfeita!
          </div>
        </div>
      </q-card-section>
      <q-separator style="height: 2px;" class="bg-negative q-mr-md q-ml-md" />
      <q-card-actions align="right" class="q-mr-sm q-mb-xs flex items-center">
        <q-btn flat label="Cancelar" color="grey-7" @click="fecharDialogExcluir" style="border-radius: 20px;"
          class="hover-scale" />
        <q-btn label="Excluir" color="negative" @click="excluirEndereco" icon="delete" style="border-radius: 20px;"
          class="hover-scale" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { CriarEndereco, EditarEndereco, DeletarEndereco } from 'src/services/enderecoServices'
import type { Endereco, Usuario } from 'src/types/types';
import { useAuth } from 'src/composables/useAuth';

// Props ---
const props = defineProps<{
  dialogListaEnderecos: boolean
  enderecos?: Endereco[]
  usuarioId: string
}>()

const emit = defineEmits(['update:dialogListaEnderecos', 'atualizarLista'])

// Utils ---
const { getUser } = useAuth()
const user = getUser() as Usuario
const $q = useQuasar()

// Refs ---
const dialogListaEnderecos = ref(props.dialogListaEnderecos)
const dialogGravar = ref(false)
const dialogEditar = ref(false)
const dialogExcluir = ref(false)

const form = ref<Endereco>({
  bairro: '',
  cep: '',
  cidade: '',
  complemento: '',
  estado: '',
  logradouro: '',
  numero: ''
})

const enderecos = ref<Endereco[]>(props.enderecos || [])
const enderecoSelecionado = ref<Endereco | null>(null)
const enderecoId = ref<string | null>(null)

const estadosBrasileiros = [
  { label: 'AC', value: 'AC' },
  { label: 'AL', value: 'AL' },
  { label: 'AP', value: 'AP' },
  { label: 'AM', value: 'AM' },
  { label: 'BA', value: 'BA' },
  { label: 'CE', value: 'CE' },
  { label: 'DF', value: 'DF' },
  { label: 'ES', value: 'ES' },
  { label: 'GO', value: 'GO' },
  { label: 'MA', value: 'MA' },
  { label: 'MT', value: 'MT' },
  { label: 'MS', value: 'MS' },
  { label: 'MG', value: 'MG' },
  { label: 'PA', value: 'PA' },
  { label: 'PB', value: 'PB' },
  { label: 'PR', value: 'PR' },
  { label: 'PE', value: 'PE' },
  { label: 'PI', value: 'PI' },
  { label: 'RJ', value: 'RJ' },
  { label: 'RN', value: 'RN' },
  { label: 'RS', value: 'RS' },
  { label: 'RO', value: 'RO' },
  { label: 'RR', value: 'RR' },
  { label: 'SC', value: 'SC' },
  { label: 'SP', value: 'SP' },
  { label: 'SE', value: 'SE' },
  { label: 'TO', value: 'TO' }
]

// Watch dos endereços ---
watch(() => props.enderecos, (novos) => {
  if (novos) {
    enderecos.value = novos
  }
}, { immediate: true, deep: true })

// Watch do Dialog Principal ---
watch(() => props.dialogListaEnderecos, val => {
  dialogListaEnderecos.value = val
})

watch(dialogListaEnderecos, val => {
  emit('update:dialogListaEnderecos', val)
})

// Methods ---
const abrirDialogAdicionar = () => {
  limparFormulario()
  dialogGravar.value = true
}

const abrirDialogEditar = (endereco: Endereco) => {
  enderecoSelecionado.value = endereco
  form.value = {
    bairro: endereco.bairro,
    cep: formatarCEP(endereco.cep),
    cidade: endereco.cidade,
    complemento: endereco.complemento || '',
    estado: endereco.estado,
    logradouro: endereco.logradouro,
    numero: endereco.numero
  }
  enderecoId.value = endereco.id || null
  dialogEditar.value = true
}

const abrirDialogExcluir = (endereco: Endereco) => {
  enderecoSelecionado.value = endereco
  enderecoId.value = endereco.id || null
  dialogExcluir.value = true
}

const fecharDialogGravar = () => {
  dialogGravar.value = false
  limparFormulario()
}

const fecharDialogEditar = () => {
  dialogEditar.value = false
  limparFormulario()
}

const fecharDialogExcluir = () => {
  dialogExcluir.value = false
  enderecoSelecionado.value = null
  enderecoId.value = null
}

// CRUD Endereços
const gravarEndereco = async () => {
  if (!validarCampos()) return
  try {
    $q.loading.show({ message: 'Salvando endereço...' })
    const data = {
      bairro: form.value.bairro.trim(),
      cep: form.value.cep.replace(/\D/g, ''),
      cidade: form.value.cidade.trim(),
      complemento: form.value.complemento.trim() || '',
      estado: form.value.estado,
      logradouro: form.value.logradouro.trim(),
      numero: form.value.numero.trim()
    }
    await CriarEndereco(data, props.usuarioId, user.token)
    $q.notify({
      type: 'positive',
      message: 'Endereço cadastrado com sucesso!',
      timeout: 2000,
      position: 'bottom',
    })
    emit('atualizarLista')
    fecharDialogGravar()
  } catch (err) {
    console.error("Erro ao gravar endereço:", err)
    $q.notify({
      type: 'negative',
      message: 'Erro ao salvar endereço',
      timeout: 2000,
      position: 'bottom',
    })
  } finally {
    $q.loading.hide()
  }
}

const editarEndereco = async () => {
  if (!enderecoId.value) {
    $q.notify({
      type: 'warning',
      message: 'Endereço não encontrado!',
      timeout: 2000,
      position: 'bottom',
    })
    return
  }
  if (!validarCampos()) return
  try {
    $q.loading.show({ message: 'Alterando endereço...' })
    const data = {
      bairro: form.value.bairro.trim(),
      cep: form.value.cep.replace(/\D/g, ''),
      cidade: form.value.cidade.trim(),
      complemento: form.value.complemento.trim() || '',
      estado: form.value.estado,
      logradouro: form.value.logradouro.trim(),
      numero: form.value.numero.trim()
    }
    await EditarEndereco(enderecoId.value, data, user.token)
    $q.notify({
      type: 'positive',
      message: 'Endereço atualizado com sucesso!',
      timeout: 2000,
      position: 'bottom',
    })
    emit('atualizarLista')
    fecharDialogEditar()
  } catch (err) {
    console.error("Erro ao editar endereço:", err)
    $q.notify({
      type: 'negative',
      message: 'Erro ao atualizar endereço',
      timeout: 2000,
      position: 'bottom',
    })
  } finally {
    $q.loading.hide()
  }
}

const excluirEndereco = async () => {
  if (!enderecoId.value) {
    $q.notify({
      type: 'warning',
      message: 'Endereço não encontrado!',
      timeout: 2000,
      position: 'bottom',
    })
    return
  }
  try {
    $q.loading.show({ message: 'Excluindo endereço...' })
    await DeletarEndereco(enderecoId.value, user.token)
    $q.notify({
      type: 'positive',
      message: 'Endereço excluído com sucesso!',
      timeout: 2000,
      position: 'bottom',
    })
    emit('atualizarLista')
    fecharDialogExcluir()
  } catch (err) {
    console.error("Erro ao excluir endereço:", err)
    $q.notify({
      type: 'negative',
      message: 'Erro ao excluir endereço',
      timeout: 2000,
      position: 'bottom',
    })
  } finally {
    $q.loading.hide()
  }
}

// Métodos Uteis ---
const formatarCEP = (cep: string): string => {
  if (!cep) return ''
  const apenasNumeros = cep.replace(/\D/g, '')
  if (apenasNumeros.length === 8) {
    return `${apenasNumeros.slice(0, 5)}-${apenasNumeros.slice(5)}`
  }
  return cep
}

const limparFormulario = () => {
  form.value = {
    bairro: '',
    cep: '',
    cidade: '',
    complemento: '',
    estado: '',
    logradouro: '',
    numero: ''
  }
  enderecoId.value = null
}

const validarCampos = (): boolean => {
  if (!form.value.cep || !form.value.logradouro || !form.value.numero ||
    !form.value.bairro || !form.value.cidade || !form.value.estado) {
    $q.notify({
      type: 'warning',
      message: 'Por favor, preencha todos os campos obrigatórios!',
      timeout: 2000,
      position: 'bottom',
    })
    return false
  }

  const cepLimpo = form.value.cep.replace(/\D/g, '')
  if (cepLimpo.length !== 8) {
    $q.notify({
      type: 'warning',
      message: 'CEP inválido! Digite um CEP válido.',
      timeout: 2000,
      position: 'bottom',
    })
    return false
  }

  if (form.value.estado.length !== 2) {
    $q.notify({
      type: 'warning',
      message: 'Selecione um estado válido!',
      timeout: 2000,
      position: 'bottom',
    })
    return false
  }
  return true
}
</script>

<style scoped>
.hover-scale {
  transition: transform 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}

.hover-card {
  transition: all 0.3s ease;
}

.hover-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}
</style>
