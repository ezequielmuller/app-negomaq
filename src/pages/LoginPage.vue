<template>
  <q-page class="flex flex-center" padding>

    <!-- Card de Login -->
    <q-card style="width: 350px; height: 500px">
      <q-card-section class="flex flex-center">
        <img src="icons/app-logo-sfundo.png" alt="Logo da Empresa" style="width: 150px; height: 150px" />
      </q-card-section>

      <q-card-section>
        <q-input class="full-width" label="Email" v-model="email" />
        <q-input class="full-width" label="Senha" v-model="senha" :type="ocultarSenha ? 'password' : 'text'">
          <template #append>
            <q-icon :name="ocultarSenha ? 'visibility_off' : 'visibility'" class="cursor-pointer"
              @click="ocultarSenha = !ocultarSenha" />
          </template>
        </q-input>
        <q-toggle label="Lembrar senha" color="primary" v-model="lembrarSenha" class="q-mt-sm" />
      </q-card-section>

      <q-card-section class="flex flex-center">
        <q-btn color="primary" label="ENTRAR" class="full-width" style="border-radius: 10px" @click="entrarSistema()" />
        <div class="q-mt-md flex items-center">
          <p class="q-mb-none">Não tem uma Conta?</p>
          <span class="text-primary text-bold q-ml-xs">Cadastre-se!</span>
        </div>
      </q-card-section>
    </q-card>

  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
const $q = useQuasar()
const router = useRouter()

const lembrarSenha = ref(false)
const email = ref(null)
const senha = ref(null)
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

    await router.push('/home')

  } catch (error) {
    console.error('ERRO DE LOGIN => ', error)
    $q.notify({
      type: 'negative',
      message: 'Não foi possível fazer Login!',
      position: 'center',
      timeout: 2500
    })
  } finally {
    $q.loading.hide()
  }
}

</script>
