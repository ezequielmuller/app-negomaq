<template>
  <q-page class="flex flex-center" padding>

    <!-- Card de Login -->
    <q-card style="width: 350px; height: 500px">
      <q-card-section class="flex flex-center">
        <img src="icons/app-logo-sfundo.png" alt="Logo da Empresa" style="width: 150px; height: 150px" />
      </q-card-section>

      <q-card-section>
        <q-input class="full-width" label="Email" v-model="email">
          <template #prepend>
            <q-icon name="alternate_email" />
          </template>
        </q-input>
        <q-input class="full-width" label="Senha" v-model="senha" :type="ocultarSenha ? 'password' : 'text'">
          <template #prepend>
            <q-icon name="lock" />
          </template>
          <template #append>
            <q-icon :name="ocultarSenha ? 'visibility_off' : 'visibility'" class="cursor-pointer"
              @click="ocultarSenha = !ocultarSenha" />
          </template>
        </q-input>
        <q-toggle label="Lembrar senha" color="primary" v-model="lembrarSenha" class="q-mt-sm" />
      </q-card-section>

      <q-card-section class="flex flex-center column">
        <q-btn color="primary" label="ENTRAR" class="full-width" style="border-radius: 10px" @click="entrarSistema()" />
        <div class="q-mt-md flex items-center justify-center" style="width: 100%; font-size: 14px;">
          <p class="q-mb-none">Não tem uma Conta?</p>
          <span class="text-primary text-bold q-ml-xs cursor-pointer" @click="irParaCadastro">
            Cadastre-se!
          </span>
        </div>
      </q-card-section>
    </q-card>

  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import api from 'src/services/api'

const $q = useQuasar()
const router = useRouter()

const lembrarSenha = ref(false)
const email = ref('')
const senha = ref('')
const ocultarSenha = ref(true)

const entrarSistema = async () => {
  if (!email.value || !senha.value) {
    $q.notify({
      type: 'warning',
      message: 'Campos não preenchidos',
      position: 'bottom',
      timeout: 2000
    })
    return
  }
  try {
    $q.loading.show({ message: 'Entrando...' })
    await api.post('auth/login', {
      email: email.value,
      senha: senha.value
    })
    await router.push('/home')
    $q.loading.hide()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: 'Não foi possivel realizar login, Verifique os campos!',
      position: 'bottom',
      timeout: 2500
    })
  } finally {
    $q.loading.hide()
  }
}

const irParaCadastro = async () => {
  try {
    $q.loading.show({ message: 'Carregando...' })
    await router.push('/cadastro')
    $q.loading.hide()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: 'Não foi possivel ir para o cadastro!',
      position: 'bottom',
      timeout: 2500
    })
  } finally {
    $q.loading.hide()
  }
}

onMounted(() => {
  const salvarLogin = localStorage.getItem('lembrarEmail')
  const salvarSenha = localStorage.getItem('lembrarSenha')
  if (salvarLogin) {
    email.value = salvarLogin
    lembrarSenha.value = true
  }
  if (salvarSenha) {
    senha.value = salvarSenha
  }
})

watch([lembrarSenha, email, senha], ([lembrar, emailVal, senhaVal]) => {
  if (lembrar && emailVal) {
    localStorage.setItem('lembrarEmail', emailVal)
    localStorage.setItem('lembrarSenha', senhaVal)
  } else if (!lembrar) {
    localStorage.removeItem('lembrarEmail')
    localStorage.removeItem('lembrarSenha')
  }
})

</script>
