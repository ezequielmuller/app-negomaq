<template>
  <div>
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h6 text-bold">Selecione um Endereço de Entrega</div>
      <q-btn icon="add" label="Novo Endereço" color="primary" @click="abrirManipularEnderecos" class="hover-scale"
        style="border-radius: 20px;" />
    </div>
    <div v-if="carregando" class="row justify-center q-pa-lg">
      <q-spinner color="primary" size="50px" />
    </div>
    <div v-else-if="enderecos.length === 0" class="text-center q-pa-lg bg-grey-2" style="border-radius: 12px;">
      <q-icon name="location_off" size="64px" color="grey-6" />
      <div class="text-subtitle1 q-mt-md text-grey-6">Nenhum endereço cadastrado</div>
      <div class="text-caption text-grey-6 q-mb-md">Clique em "Novo Endereço" para adicionar um</div>
    </div>
    <div v-else class="q-gutter-md">
      <q-card v-for="endereco in enderecos" :key="endereco.id || Math.random()"
        :bordered="endereco.id !== enderecSelecionado?.id"
        :class="{ 'bg-red-1': endereco.id === enderecSelecionado?.id }" class="cursor-pointer transition-all hover-card"
        style="border-radius: 12px; border: 2px solid; transition: all 0.3s;"
        :style="{ borderColor: endereco.id === enderecSelecionado?.id ? '#b81414' : '#e0e0e0' }"
        @click="selecionarEndereco(endereco)">
        <q-card-section class="q-pa-md">
          <div class="row items-start justify-between">
            <div class="col">
              <div class="row items-center q-mb-xs">
                <q-icon
                  :name="endereco.id === enderecSelecionado?.id ? 'radio_button_checked' : 'radio_button_unchecked'"
                  :color="endereco.id === enderecSelecionado?.id ? 'primary' : 'grey-5'" size="24px" class="q-mr-sm" />
                <div class="text-subtitle1 text-bold">
                  {{ endereco.logradouro }}, {{ endereco.numero }}
                </div>
              </div>
              <div class="text-body2 text-grey-7 q-ml-xl">
                <div v-if="endereco.complemento" class="q-mb-xs">{{ endereco.complemento }}</div>
                <div class="q-mb-xs">{{ endereco.bairro }}</div>
                <div class="q-mb-xs">{{ endereco.cidade }} - {{ endereco.estado }}</div>
                <div class="text-caption text-grey-6">
                  CEP: {{ formatarCEP(endereco.cep) }}
                </div>
              </div>
            </div>
            <div class="col-auto row q-gutter-xs">
              <q-btn icon="edit" flat round color="amber-9" size="sm" @click.stop="abrirManipularEnderecosEditar()"
                class="hover-scale">
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn icon="delete" flat round color="negative" size="sm" @click.stop="abrirManipularEnderecosExcluir()"
                class="hover-scale">
                <q-tooltip>Excluir</q-tooltip>
              </q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <ManipularEnderecos v-model:dialogListaEnderecos="dialogManipularAberto" :enderecos="enderecos"
      :usuarioId="usuarioId" @atualizarLista="listarEnderecos" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { ListarEnderecos } from 'src/services/enderecoServices'
import ManipularEnderecos from 'src/components/UserPage/ManipularEnderecos.vue'
import type { Endereco, Usuario } from 'src/types/types'
import { useAuth } from 'src/composables/useAuth'
// Props e Emits---
const props = defineProps<{
  usuarioId: string
}>()
const emit = defineEmits<{
  'endereco-selecionado': [endereco: Endereco]
}>()

// Utils ---
const { getUser } = useAuth()
const user = getUser() as Usuario
const $q = useQuasar()
// Refs ---
const enderecos = ref<Endereco[]>([])
const enderecSelecionado = ref<Endereco | null>(null)
const carregando = ref(false)
const dialogManipularAberto = ref(false)

// Methods ---
const listarEnderecos = async () => {
  try {
    carregando.value = true
    const response = await ListarEnderecos(props.usuarioId, user.token)
    enderecos.value = response || []
  } catch (err) {
    console.error('Erro ao listar endereços:', err)
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar endereços',
      timeout: 2000,
      position: 'bottom'
    })
  } finally {
    carregando.value = false
  }
}

const selecionarEndereco = (endereco: Endereco) => {
  enderecSelecionado.value = endereco
  emit('endereco-selecionado', endereco)
}

const abrirManipularEnderecos = () => {
  dialogManipularAberto.value = true
}

const abrirManipularEnderecosEditar = () => {
  dialogManipularAberto.value = true
}

const abrirManipularEnderecosExcluir = () => {
  dialogManipularAberto.value = true
}

const formatarCEP = (cep: string): string => {
  if (!cep) return ''
  const apenasNumeros = cep.replace(/\D/g, '')
  if (apenasNumeros.length === 8) {
    return `${apenasNumeros.slice(0, 5)}-${apenasNumeros.slice(5)}`
  }
  return cep
}

// Lifecycle
onMounted(async () => {
  await listarEnderecos()
})
</script>

<style scoped>
.hover-card {
  transition: all 0.3s ease;
}

.hover-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.hover-scale {
  transition: transform 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}

.cursor-pointer {
  cursor: pointer;
}

.transition-all {
  transition: all 0.3s ease;
}
</style>
