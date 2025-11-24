<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="text-h5 text-bold q-ml-sm q-mt-sm">Painel do Usuário</div>
    </div>
    <q-separator class="q-mb-md" />
    <q-card class="q-pa-md q-mb-md shadow-2" style="border-radius: 20px; border: 0.7mm solid var(--q-primary);">
      <div class="column items-center q-gutter-xs">
        <q-avatar size="80px" color="primary" text-color="white" icon="person" />
        <div class="text-h6 q-mt-sm">
          {{ nomeCompleto }}
        </div>
        <div class="text-subtitle2 text-grey">
          <q-icon name="email" size="16px" class="q-mr-xs" />
          {{ user?.email || 'Sem email cadastrado' }}
        </div>
        <div class="text-subtitle2 text-grey">
          <q-icon name="phone" size="16px" class="q-mr-xs" />
          {{ telefoneMostrar || 'Sem telefone cadastrado' }}
        </div>
        <div class="text-subtitle2 text-grey flex items-center">
          <q-icon name="badge" size="16px" class="q-mr-xs" />
          {{ user?.cpf || 'Sem CPF cadastrado' }}
        </div>
        <div class="row justify-center q-mt-md q-gutter-sm flex-wrap">
          <q-btn color="teal" icon="home" label="Meus endereços" @click="abrirDialogEnderecos"
            style="border-radius: 20px;" class="hover-scale" />
          <q-btn color="primary" icon="edit" label="Editar Perfil" @click="abrirDialogEditarUsuario"
            style="border-radius: 20px;" class="hover-scale" />
          <q-btn outline color="primary" icon="logout" label="Sair" @click="confirmarSaida" style="border-radius: 20px;"
            class="hover-scale" />
        </div>
      </div>
    </q-card>
    <!-- Tabs -->
    <q-tabs v-model="tab" inline-label outside-arrows mobile-arrows class="bg-grey-4 text-primary shadow-2"
      style="border-radius: 16px;">
      <q-tab name="produtos" icon="inventory_2" label="Produtos" v-if="user?.is_admin" />
      <q-tab name="pedidos" icon="sell" label="Pedidos" v-if="user?.is_admin" />
      <q-tab name="vendas" icon="payments" label="Vendas" v-if="user?.is_admin" />
      <q-tab name="minhasCompras" icon="shopping_cart" label="Minhas Compras" />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="produtos">
        <ListaProdutosAdmin />
      </q-tab-panel>
      <q-tab-panel name="pedidos">
        <div class="text-center q-pa-xl text-grey-6">
          <q-icon name="pending_actions" size="64px" />
          <div class="text-h6 q-mt-md">Pedidos em desenvolvimento</div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="vendas">
        <div class="text-center q-pa-xl text-grey-6">
          <q-icon name="point_of_sale" size="64px" />
          <div class="text-h6 q-mt-md">Vendas em desenvolvimento</div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="minhasCompras">
        <div class="text-center q-pa-xl text-grey-6">
          <q-icon name="shopping_bag" size="64px" />
          <div class="text-h6 q-mt-md">Minhas Compras em desenvolvimento</div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
    <!-- Componente Endereços -->
    <ManipularEnderecos v-model:dialog-lista-enderecos="dialogEnderecos" :enderecos="listaEnderecos"
      :usuario-id="user?.id" @atualizar-lista="buscarEnderecos" />
  </q-page>
  <!-- Dialog Editar Perfil -->
  <q-dialog v-model="dialogEditarUsuario" persistent>
    <q-card style="width: 500px; max-height: 70vh; border-radius: 20px;" class="column no-wrap">
      <q-card-section class="bg-primary text-white">
        <div class="row items-center" style="gap: 8px">
          <q-icon name="edit" size="md" />
          <div class="text-h6">Editar Perfil</div>
        </div>
      </q-card-section>
      <q-card-section class="scroll" style="flex: 1; overflow-y: auto;">
        <div class="row q-col-gutter-sm">
          <div class="col-6">
            <q-input dense outlined v-model="nome" label="Nome" />
          </div>
          <div class="col-6">
            <q-input dense outlined v-model="sobrenome" label="Sobrenome" />
          </div>
          <div class="col-12">
            <q-input dense outlined v-model="email" label="Email" type="email" />
          </div>
          <div class="col-12">
            <q-input dense outlined :model-value="telefone" @update:model-value="formatarTelefone" label="Telefone"
              mask="(##) #####-####" />
          </div>
          <div class="col-12">
            <q-input dense outlined label="CPF" v-model="cpf" clearable mask="###.###.###-##" reverse-fill-mask
              maxlength="14" />
          </div>
        </div>
      </q-card-section>
      <q-separator spaced />
      <q-card-actions align="right" class="q-mr-sm q-mb-xs">
        <q-btn outline label="Cancelar" class="hover-scale" color="primary" @click="fecharDialogEditarUsuario"
          style="border-radius: 20px;" icon="close" />
        <q-btn label="Salvar" icon="save" class="hover-scale" color="primary" @click="editarUsuario"
          :loading="salvandoPerfil" style="border-radius: 20px;" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- Dialog Confirmar Saída -->
  <q-dialog v-model="dialogConfirmarSaida" persistent>
    <q-card style="width: 400px; border-radius: 20px;">
      <q-card-section class="bg-primary text-white">
        <div class="row items-center" style="gap: 8px">
          <q-icon name="logout" size="md" />
          <div class="text-h6">Confirmar Saída</div>
        </div>
      </q-card-section>
      <q-card-section class="text-center q-pa-md">
        <q-icon name="help_outline" size="lg" color="primary" />
        <div class="text-subtitle1 q-mt-xs">Tem certeza que deseja sair?</div>
      </q-card-section>
      <q-separator spaced />
      <q-card-actions align="right" class="q-mr-sm q-mb-xs">
        <q-btn outline label="Cancelar" color="primary" class="hover-scale" v-close-popup icon="close"
          style="border-radius: 20px;" />
        <q-btn label="Sair" color="primary" icon="logout" class="hover-scale" @click="sairSistema"
          style="border-radius: 20px;" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useAuth } from 'src/composables/useAuth'
import { useCartStore } from 'src/stores/useCartStore'
import { EditarPerfil } from 'src/services/usuarioServices'
import { ListarEnderecos } from 'src/services/enderecoServices'
import ListaProdutosAdmin from 'src/components/UserPage/ListaProdutosAdmin.vue'
import ManipularEnderecos from 'src/components/UserPage/ManipularEnderecos.vue'
import type { Endereco, Usuario, UsuarioEdicao } from 'src/types/types'
// Utils ---
const $q = useQuasar()
const router = useRouter()
const { getUser, saveUser, removeUser } = useAuth()
const cart = useCartStore()
const user = getUser() as Usuario
// --- Refs ---
const dialogEditarUsuario = ref(false)
const dialogEnderecos = ref(false)
const dialogConfirmarSaida = ref(false)
const nome = ref('')
const sobrenome = ref('')
const email = ref('')
const cpf = ref('')
const telefone = ref('')
const salvandoPerfil = ref(false)
const carregandoEnderecos = ref(false)
const listaEnderecos = ref<Endereco[]>([])
const tab = ref(user?.is_admin ? 'produtos' : 'minhasCompras')

// Computed ---
const nomeCompleto = computed(() =>
  user?.nome && user?.sobrenome ? `${user.nome} ${user.sobrenome}` : user?.nome || 'Sem nome cadastrado'
)
const telefoneMostrar = computed(() => {
  if (!user?.telefone) return ''
  const tel = user.telefone.replace(/\D/g, '')
  if (tel.length === 11) {
    return `(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7)}`
  }
  return user.telefone
})

// Methdos ---
const abrirDialogEditarUsuario = () => {
  nome.value = user.nome || ''
  sobrenome.value = user.sobrenome || ''
  email.value = user.email || ''
  cpf.value = user.cpf || ''
  // formatacao telefone
  if (user.telefone) {
    const tel = user.telefone.replace(/\D/g, '')
    if (tel.length === 11) {
      telefone.value = `(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7)}`
    } else {
      telefone.value = user.telefone
    }
  } else {
    telefone.value = ''
  }
  dialogEditarUsuario.value = true
}

const fecharDialogEditarUsuario = () => {
  dialogEditarUsuario.value = false
}

const editarUsuario = async () => {
  if (!nome.value.trim() || !sobrenome.value.trim() || !email.value.trim() || !telefone.value || !cpf.value) {
    $q.notify({
      type: 'warning',
      message: 'Campos vazios, verifique!',
      position: 'bottom',
      timeout: 2500
    })
    return
  }
  if (!validarEmail(email.value)) return;
  try {
    $q.loading.show({ message: 'Editando perfil...' })
    const data: UsuarioEdicao = {
      email: user.email,
      novo_nome: nome.value.trim(),
      novo_sobrenome: sobrenome.value.trim(),
      novo_email: email.value.trim(),
      novo_telefone: telefone.value,
      novo_cpf: cpf.value,
    }
    console.log(user.token)
    const result = await EditarPerfil(data, user.token)
    const usuarioAtualizado = {
      ...user,
      nome: data.novo_nome || user.nome,
      sobrenome: data.novo_sobrenome || user.sobrenome,
      email: data.novo_email || user.email,
      telefone: data.novo_telefone || user.telefone,
      cpf: data.novo_cpf || user.cpf
    }
    removeUser()
    saveUser(usuarioAtualizado)
    fecharDialogEditarUsuario()
    if (!result) return
    $q.loading.show({
      message: 'Atualizando...',
      spinnerSize: 140,
    })

    // pequeno delay só para mostrar o loading
    setTimeout(() => {
      window.location.reload()
    }, 800)
    $q.notify({
      type: 'positive',
      message: 'Perfil atualizado com sucesso!',
      position: 'bottom',
      timeout: 2000
    })
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err)
    $q.notify({
      type: 'negative',
      message: 'Não foi possivel editar o perfil!',
      position: 'bottom',
      timeout: 2500
    })
  } finally {
    $q.loading.hide()
  }
}

const abrirDialogEnderecos = async () => {
  if (!user?.id) {
    $q.notify({ type: 'negative', message: 'Usuário não identificado!' })
    return
  }
  carregandoEnderecos.value = true
  await buscarEnderecos()
  carregandoEnderecos.value = false
  dialogEnderecos.value = true
}

const buscarEnderecos = async () => {
  try {
    const res = await ListarEnderecos(user.id, user.token)
    listaEnderecos.value = Array.isArray(res) ? res : []
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Erro ao carregar endereços!' })
  }
}

const confirmarSaida = () => {
  dialogConfirmarSaida.value = true
}

const sairSistema = async () => {
  $q.loading.show({ message: 'Saindo...' })
  removeUser()
  cart.limparCarrinho()
  await router.push('/home')
  $q.loading.hide()
  window.location.reload()
}

// Metodos uteis ---
function formatarTelefone(valor: string | number | null) {
  if (!valor) {
    telefone.value = ''
    return
  }
  let v = String(valor).replace(/\D/g, '')
  if (v.length > 11) v = v.slice(0, 11)
  if (v.length > 0) v = v.replace(/^(\d{2})(\d)/g, '($1) $2')
  if (v.length > 10) v = v.replace(/(\d{5})(\d{4})$/, '$1-$2')
  else if (v.length > 9) v = v.replace(/(\d{4})(\d{4})$/, '$1-$2')
  telefone.value = v
}

function validarEmail(val: string) {
  const emailTrim = (val || '').trim()
  const arroba = emailTrim.indexOf('@')
  const ponto = emailTrim.indexOf('.', arroba)

  if (!emailTrim || arroba < 1 || ponto <= arroba + 1) {
    $q.notify({
      type: 'warning',
      message: 'Email inválido! Deve conter "@" e um "." após o @',
      position: 'bottom',
      timeout: 2500
    })
    return false
  }
  return true
}
</script>
