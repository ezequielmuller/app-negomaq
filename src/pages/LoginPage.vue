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
import axios from 'axios'

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
      position: 'center',
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

    $q.notify({
      type: 'positive',
      message: 'Login efetuado com sucesso!',
      position: 'center',
      timeout: 1500
    })

    await router.push('/home')

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('ERRO DE LOGIN => ', error.response?.data || error.message)
      $q.notify({
        type: 'negative',
        message: error.response?.data?.mensagem || 'Não foi possível fazer Login!',
        position: 'center',
        timeout: 2500
      })
    } else {
      console.error(error)
      $q.notify({
        type: 'negative',
        message: 'Erro inesperado!',
        position: 'center',
        timeout: 2500
      })
    }
  }
}

const irParaCadastro = async () => {
  await router.push('/cadastro')
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
