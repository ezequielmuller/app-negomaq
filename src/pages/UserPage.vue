<template>
  <q-page padding>
    <div class="row items-center">
      <q-btn flat round color="primary" icon="arrow_back" size="md" to="/home" />
      <div class="text-h5 text-bold q-ml-sm">Painel do Usuário</div>
    </div>

    <q-separator class="q-mb-md" />

    <q-card class="q-pa-md q-mb-md shadow-2">
      <div class="row q-col-gutter-sm items-center">
        <div class="col-12 col-md-8 col-sm-8 row items-center">
          <q-avatar size="60px" color="primary" text-color="white" icon="person" />
          <div class="column q-ml-md">
            <div class="text-h6">Ezequiel H. G. Muller</div>
            <div class="text-subtitle2 text-grey">zikimuller017@gmail.com</div>
          </div>
        </div>

        <div class="col-12 col-md-4 col-sm-4 flex justify-end q-mt-sm q-mt-md-none">
          <q-btn color="primary" icon="edit" label="Editar Perfil" @click="abrirDialogEditarUsuario()" />
        </div>
      </div>
    </q-card>


    <q-tabs v-model="tab" dense align="left" class="bg-primary text-white shadow-2" :breakpoint="0"
      active-color="green-4">
      <q-tab name="user" icon="person" label="Usuário" />
      <q-tab name="admin" icon="settings" label="Admin" />
    </q-tabs>


    <q-tab-panels v-model="tab" animated>

      <!-- ======= // PAINEL USER // ========= -->
      <q-tab-panel name="user">
        <q-card class="q-pa-md q-mt-md">
          <div class="text-h6">Informações Pessoais</div>
          <q-separator spaced />
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label>Nome</q-item-label>
                <q-item-label caption>Ezequiel</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>Sobrenome</q-item-label>
                <q-item-label caption>H. G. Muller</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>Email</q-item-label>
                <q-item-label caption>zikimuller017@gmail.com</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>Telefone</q-item-label>
                <q-item-label caption>(54) 9 9922-8928</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>Senha</q-item-label>
                <q-item-label caption>negomaq123</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </q-tab-panel>

      <!-- ======= // PAINEL ADMIN // ========= -->
      <q-tab-panel name="admin">
        <q-card class="q-pa-md q-mt-md">
          <div class="text-h6">Configurações de Admin</div>
          <q-separator spaced />
          <q-btn color="primary" icon="add" label="ADD FACA" @click="novoProduto" />
          <q-btn color="primary" icon="edit_square" label="EDIT FACA" @click="alterarProduto" />
          <FacasManipular v-model:dialogGravar="dialogGravar" v-model:dialogEditar="dialogEditar" />

        </q-card>
      </q-tab-panel>
    </q-tab-panels>

    <!-- ======= // DIALOG EDITAR // ========= -->
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
            <div class="col-6">
              <q-input dense flat outlined v-model="nome" label="Nome" />
            </div>
            <div class="col-6">
              <q-input dense flat outlined v-model="sobrenome" label="Sobrenome" />
            </div>
            <div class="col-12">
              <q-input dense flat outlined v-model="email" label="Email" />
            </div>
            <div class="col-12">
              <q-input dense flat outlined v-model="telefone" label="Telefone" />
            </div>
            <div class="col-12">
              <q-input dense outlined v-model="senha" :type="senhaVisivel ? 'password' : 'text'" label="Senha">
                <template v-slot:append>
                  <q-icon :name="senhaVisivel ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click="senhaVisivel = !senhaVisivel" />
                </template>
              </q-input>
            </div>
            <div class="col-12">
              <q-input dense outlined v-model="confirmarSenha" :type="senhaVisivelConfirmar ? 'password' : 'text'"
                label="Senha">
                <template v-slot:append>
                  <q-icon :name="senhaVisivelConfirmar ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click="senhaVisivelConfirmar = !senhaVisivelConfirmar" />
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>

        <q-separator style="height: 3px;" class="bg-primary q-mr-md q-ml-md" />

        <q-card-actions align="right" class="q-mr-sm q-mb-xs">
          <q-btn icon="close" outline label="Fechar" color="primary" v-close-popup />
          <q-btn icon="save" label="Salvar" color="primary" @click="editarUsuario()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import FacasManipular from 'src/components/facas/FacasManipular.vue'

const $q = useQuasar()

const tab = ref('user')

const dialogEditarUsuario = ref(false)
const nome = ref(null)
const sobrenome = ref(null)
const email = ref(null)
const telefone = ref(null)
const senha = ref(null)
const confirmarSenha = ref(null)
const senhaVisivel = ref(true)
const senhaVisivelConfirmar = ref(true)

const dialogGravar = ref(false)
const dialogEditar = ref(false)

const abrirDialogEditarUsuario = () => {
  dialogEditarUsuario.value = true
}

const novoProduto = () => {
  dialogGravar.value = true
}
const alterarProduto = () => {
  dialogEditar.value = true
}

const editarUsuario = () => {
  //async - await na chamada tbm
  try {
    $q.loading.show({ message: 'Carregando Alterações...' })
    const data = {
      nome: nome.value,
      sobrenome: sobrenome.value,
      email: email.value,
      telefone: telefone.value,
      senha: senha.value
    }
    console.log('JSON editar usuario=> ', data)
    dialogEditarUsuario.value = false
    $q.notify({
      type: 'positive',
      message: 'Dados de Usuário Alterado com Sucesso!',
      position: 'center',
      timeout: 2500
    })
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: 'Não foi possivel editar os dados!',
      position: 'center',
      timeout: 2500
    })
  } finally {
    $q.loading.hide()
  }
}
</script>
