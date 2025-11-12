<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="text-h5 text-bold q-ml-sm q-mt-sm">Painel do Usuário</div>
    </div>
    <q-separator class="q-mb-md" />
    <q-card class="q-pa-md q-mb-md shadow-2" style="border-radius: 20px; border: 0.7mm solid var(--q-primary);">
      <div class="column items-center q-gutter-xs">
        <q-avatar size="60px" color="primary" text-color="white" icon="person" />
        <div class="text-h6">
          {{ user?.nome == '' || user?.nome == null ? 'Sem nome cadastrado' : user?.nome }}
        </div>
        <div class="text-subtitle2 text-grey">
          {{ user?.email == '' || user?.email == null ? 'Sem email cadastrado' : user?.email }}
        </div>
        <div class="text-subtitle2 text-grey">
          {{ user?.telefone == '' || user?.telefone == null ? 'Sem telefone cadastrado' : user?.telefone }}
        </div>
        <div class="row justify-center q-mt-sm">
          <q-btn color="primary" icon="edit" label="Editar Perfil" @click="abrirDialogEditarUsuario"
            style="border-radius: 20px;" class="hover-scale" />
          <q-btn outline color="primary" icon="logout" label="Sair" @click="sairSistema()" style="border-radius: 20px;"
            class="q-ml-sm hover-scale" />
        </div>
      </div>
    </q-card>
    <q-tabs v-model="tab" inline-label outside-arrows mobile-arrows class="bg-grey-4 text-primary shadow-2"
      style="border-radius: 16px;">
      <q-tab name="produtos" icon="inventory_2" label="Produtos" v-if="user.is_admin === false" />
      <q-tab name="pedidos" icon="sell" label="Pedidos" v-if="user.is_admin === false" />
      <q-tab name="vendas" icon="payments" label="Vendas" v-if="user.is_admin === false" />
      <q-tab name="minhasCompras" icon="shopping_cart" label="Minhas Compras" />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="produtos">
        <ListaProdutosAdmin />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
  <!-- Dialog Editar Usuário -->
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
          <div class="col-12"><q-input dense flat outlined :model-value="telefone"
              @update:model-value="formatarTelefone" label="Telefone" /></div>
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
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { EditarUsuario } from 'src/services/apiServices'
import { useRouter } from "vue-router";
import { useAuth } from 'src/composables/useAuth'
import { useCartStore } from 'src/stores/useCartStore'
import ListaProdutosAdmin from 'src/components/UserPage/ListaProdutosAdmin.vue'

// Variaveis ---
const cart = useCartStore()
const $q = useQuasar()
const router = useRouter();
const { getUser, removeUser } = useAuth()
const user = getUser()
const dialogEditarUsuario = ref(false)
const nome = ref('')
const sobrenome = ref('')
const email = ref('')
const cpf = ref('')
const telefone = ref('')
const senha = ref('')
const senhaVisivel = ref(true)
const tab = user.is_admin === true ? ref('produtos') : ref('minhasCompras')
// const admin = ref(false)

// Methods ---
const abrirDialogEditarUsuario = () => {
  dialogEditarUsuario.value = true
  nome.value = user.nome ?? ''
  sobrenome.value = user.sobrenome ?? ''
  email.value = user.email ?? ''
  telefone.value = user.telefone ?? ''
  senha.value = ''
}
const editarUsuario = async () => {
  try {
    $q.loading.show({ message: 'Editando Perfil...' })
    const data = {
      id: user.id,
      nome: nome.value,
      sobrenome: sobrenome.value,
      email: email.value,
      cpf: cpf.value,
      telefone: telefone.value,
      senha: senha.value,
      is_admin: user.is_admin
    }
    console.log(data)
    const result = await EditarUsuario(data)
    console.log(result)
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
    cart.limparCarrinho()
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
// metodos uteis ---
function formatarTelefone(valor: string | number | null) {
  if (valor === null) {
    telefone.value = '';
    return;
  }
  let v = String(valor).replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);

  if (v.length > 0) {
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    if (v.length > 9) {
      v = v.replace(/(\d{5})(\d{4})$/, "$1-$2");
    } else if (v.length > 8) {
      v = v.replace(/(\d{4})(\d{4})$/, "$1-$2");
    }
  }
  telefone.value = v;
}
</script>
