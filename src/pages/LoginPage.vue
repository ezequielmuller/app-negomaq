<template>
  <q-page class="flex flex-center" padding>

    <!-- Card de Login -->
    <q-card style="width: 350px; height: 500px; border-radius: 20px;">
      <q-card-section class="flex flex-center">
        <img src="icons/app-logo-sfundo.png" alt="Logo da Empresa" style="width: 150px; height: 150px" />
      </q-card-section>

      <q-card-section>
        <q-input class="full-width" label="Email" v-model="email" clearable>
          <template #prepend>
            <q-icon name="alternate_email" />
          </template>
        </q-input>
        <q-input class="full-width" label="Senha" v-model="senha" :type="ocultarSenha ? 'password' : 'text'" clearable>
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

      <q-card-section class="flex flex-center column" style="margin-bottom: 0;">
        <q-btn color="primary" label="ENTRAR" class="full-width hover-scale " style="border-radius: 20px"
          @click="entrarSistema()" />
        <div class="q-mt-sm flex items-center justify-center" style="width: 100%; font-size: 14px;">
          <p class="q-mb-none">Não tem uma Conta?</p>
          <span class="text-primary text-bold q-ml-xs cursor-pointer hover-scale" @click="irParaCadastro">
            Cadastre-se!
          </span>
        </div>
        <div class="q-mt-sm flex items-center justify-center"
          style="width: 100%; font-size: 14px; text-decoration: underline;">
          <span class="text-primary text-bold q-ml-xs cursor-pointer hover-scale" @click="router.push('/home')">
            Continuar Desconectado!
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
import type { Usuario } from 'src/types/types'
import { useAuth } from 'src/composables/useAuth'

const $q = useQuasar()
const router = useRouter()
const { saveUser } = useAuth()

const lembrarSenha = ref(false)
const email = ref('')
const senha = ref('')
const ocultarSenha = ref(true)

const user = ref<Usuario | null>(null)

const entrarSistema = async () => {
  if (!email.value || !senha.value) {
    $q.notify({
      type: 'warning',
      message: 'Campos não preenchidos',
      position: 'bottom',
      timeout: 2000
    });
    return;
  }
  try {
    $q.loading.show({ message: 'Entrando...' });

    const result = await api.post('auth/login', {
      email: email.value,
      senha: senha.value
    });
    const usuario: Usuario = result.data.usuario;
    user.value = usuario;
    saveUser(usuario);
    await router.push('/home');
  } catch (error) {
    console.error('Erro no login:', error);
    $q.notify({
      type: 'negative',
      message: 'Não foi possível realizar login, verifique os campos!',
      position: 'bottom',
      timeout: 2500
    });
  } finally {
    $q.loading.hide();
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
