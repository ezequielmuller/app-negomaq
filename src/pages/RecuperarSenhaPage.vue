<template>
  <q-page padding>
    <div class="text-h6 text-bold row justify-center items-center q-mb-sm">
      Recuperar Senha
    </div>
    <q-stepper v-model="step" header-nav ref="stepper" color="primary" animated :vertical="$q.screen.lt.md">
      <!-- ETAPA 1: EMAIL -->
      <q-step :name="1" title="Email" icon="email" :done="step > 1" :header-nav="step > 1">
        <div class="">
          <div class="text-subtitle1 text-bold q-mb-md">
            Informe seu email para receber um código de recuperação
          </div>
          <q-card class="q-pa-md" style="border-radius: 12px;">
            <q-input v-model="email" outlined label="Email" type="email" dense class="q-mb-md"
              @keyup.enter="solicitarCodigo" />
            <q-banner class="bg-blue-1" style="border-radius: 8px;">
              <template v-slot:avatar>
                <q-icon name="info" color="primary" />
              </template>
              <div class="text-caption">
                Você receberá um código de 6 dígitos no seu email para confirmar sua identidade.
              </div>
            </q-banner>
          </q-card>
          <q-stepper-navigation>
            <div class="row justify-end q-mt-md">
              <q-btn color="primary" label="Enviar Código" @click="solicitarCodigo" class="hover-scale"
                style="border-radius: 20px;" />
            </div>
          </q-stepper-navigation>
        </div>
      </q-step>
      <!-- ETAPA 2: VERIFICAR CÓDIGO -->
      <q-step :name="2" title="Código" icon="verified_user" :done="step > 2" :header-nav="step > 2">
        <div class="">
          <div class="text-subtitle1 q-mb-md">
            Digite o código enviado para <span class="text-bold">{{ email }}</span>
          </div>
          <q-card class="q-pa-md" style="border-radius: 12px;">
            <div class="text-subtitle1 q-mb-md">
              Código de 6 dígitos
            </div>
            <q-input v-model="codigo" outlined label="Código" type="text" dense maxlength="6" class=""
              :rules="[val => !!val || 'Código é obrigatório', val => val.length === 6 || 'Código deve ter 6 dígitos']" />
            <q-banner class="bg-orange-1 q-mb-md" style="border-radius: 8px;">
              <template v-slot:avatar>
                <q-icon name="schedule" color="orange" />
              </template>
              <div class="text-caption">
                Código expira em: <span class="text-bold">{{ formatarTempo(tempoRestante) }}</span>
              </div>
            </q-banner>

            <q-input v-model="novaSenha" outlined label="Nova Senha" :type="mostrarSenha ? 'text' : 'password'" dense
              :rules="[val => !!val || 'Senha é obrigatória', val => val.length >= 6 || 'Mínimo 6 caracteres']">
              <template v-slot:append>
                <q-icon :name="mostrarSenha ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="mostrarSenha = !mostrarSenha" />
              </template>
            </q-input>

            <q-input v-model="confirmarSenha" outlined label="Confirmar Senha"
              :type="mostrarConfirmacao ? 'text' : 'password'" dense class="q-mb-md" :rules="[
                val => !!val || 'Confirmação de senha é obrigatória',
                val => val === novaSenha || 'As senhas não coincidem'
              ]">
              <template v-slot:append>
                <q-icon :name="mostrarConfirmacao ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="mostrarConfirmacao = !mostrarConfirmacao" />
              </template>
            </q-input>
          </q-card>
          <q-stepper-navigation>
            <div class="row justify-end q-mt-md q-gutter-sm">
              <q-btn flat @click="step = 1" color="primary" label="Voltar" class="hover-scale"
                style="border-radius: 20px;" />
              <q-btn color="primary" label="Alterar senha" @click="alterarSenha" class="hover-scale"
                style="border-radius: 20px;" />
            </div>
          </q-stepper-navigation>
        </div>
      </q-step>
    </q-stepper>
  </q-page>
</template>
<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import api from 'src/services/api'
// Utils ---
const $q = useQuasar()
const router = useRouter()
// Refs ---
const step = ref(1)
const email = ref('')
const codigo = ref('')
const novaSenha = ref('')
const confirmarSenha = ref('')
//const erroEmail = ref('')
const erroCodigo = ref('')
const mostrarSenha = ref(false)
const mostrarConfirmacao = ref(false)
const carregandoEmail = ref(false)
const tempoRestante = ref(0)
const podeReenviar = ref(true)
let intervaloTempo: NodeJS.Timeout | null = null

// Methods ---
const solicitarCodigo = async () => {
  if (!validarEmail(email.value)) {
    return
  }
  try {
    carregandoEmail.value = true
    $q.loading.show({ message: 'Enviando código...' })

    const response = await api.post('/auth/recuperar/solicitar', {
      email: email.value.trim()
    })
    console.log(response)
    $q.notify({
      type: 'positive',
      message: 'Código enviado com sucesso! Verifique seu email.',
      position: 'bottom',
      timeout: 2000
    })
    step.value = 2
    iniciarContadorTempo()
  } catch (err) {
    console.error('Erro ao solicitar código:', err)
  } finally {
    carregandoEmail.value = false
    $q.loading.hide()
  }
}

const alterarSenha = async () => {
  erroCodigo.value = ''
  if (!codigo.value.trim()) {
    erroCodigo.value = 'Código é obrigatório'
    return
  }
  if (codigo.value.length !== 6) {
    erroCodigo.value = 'Código deve ter 6 dígitos'
    return
  }
  try {
    $q.loading.show({ message: 'Alterando...' })
    const response = await api.post('/auth/recuperar/verificar', {
      email: email.value.trim(),
      codigo: codigo.value.trim(),
      nova_senha: novaSenha.value.trim()
    })
    console.log(response)
    await voltarAoLogin()
    $q.notify({
      type: 'positive',
      message: 'Senha alterada com sucesso!',
      position: 'bottom',
      timeout: 2500
    })

    if (intervaloTempo) clearInterval(intervaloTempo)
  } catch (err) {
    console.error('Erro ao verificar código:', err)
  } finally {
    $q.loading.hide()
  }
}

// Metodos uteis ---
const validarEmail = (val: string) => {
  const email = (val || '').trim()
  const arroba = email.indexOf('@')
  const ponto = email.indexOf('.', arroba)
  if (!email || arroba < 1 || ponto <= arroba + 1) {
    $q.notify({
      type: 'warning',
      message: 'Verifique o e-mail: precisa conter "@" e um "." após o @!',
      position: 'bottom',
      timeout: 2500
    })
    return false
  }
  return true
}
const voltarAoLogin = async () => {
  await router.push('/login')
}

const formatarTempo = (segundos: number): string => {
  const minutos = Math.floor(segundos / 60)
  const secs = segundos % 60
  return `${minutos.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const iniciarContadorTempo = () => {
  tempoRestante.value = 900 // 15 minutos
  podeReenviar.value = false

  intervaloTempo = setInterval(() => {
    tempoRestante.value--
    if (tempoRestante.value <= 0) {
      if (intervaloTempo) clearInterval(intervaloTempo)
      podeReenviar.value = true
    }
  }, 1000)
}
onUnmounted(() => {
  if (intervaloTempo) clearInterval(intervaloTempo)
})
</script>

<style scoped>
.hover-scale {
  transition: transform 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}

.cursor-pointer {
  cursor: pointer;
}
</style>
