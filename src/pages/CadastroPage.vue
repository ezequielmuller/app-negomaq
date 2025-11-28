<template>
  <q-page class="flex flex-center" padding>
    <q-card style="width: 330px; height: 100%; border-radius: 20px;"
      class="flex flex-column items-center justify-center">
      <q-card-setion>
        <img src="icons/app-logo-sfundo.png" alt="Logo da Empresa"
          style="width: 150px; height: 150px; display: block; margin: 0 auto;" />
        <div style="font-size: 1.2rem; font-weight: bold; margin-top: 0;" class="flex justify-center">
          Cadastre-se
        </div>
      </q-card-setion>
      <q-card-section style="width: 100%;">
        <q-input class="full-width" label="Nome" v-model="nome" clearable>
          <template #prepend>
            <q-icon name="person" />
          </template>
        </q-input>
        <q-input class="full-width" label="Sobrenome" v-model="sobrenome" clearable>
          <template #prepend>
            <q-icon name="person" />
          </template>
        </q-input>
        <q-input class="full-width" label="Email" v-model="email" clearable>
          <template #prepend>
            <q-icon name="alternate_email" />
          </template>
        </q-input>
        <q-input class="full-width" label="CPF" v-model="cpf" clearable mask="###.###.###-##" reverse-fill-mask
          maxlength="14">
          <template #prepend>
            <q-icon name="badge" />
          </template>
        </q-input>
        <q-input class="full-width" label="Telefone" :model-value="telefone" @update:model-value="formatarTelefone"
          clearable maxlength="15">
          <template #prepend>
            <q-icon name="phone" />
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
        <q-input class="full-width" label="Confirmar Senha" v-model="confirmarSenha" clearable
          :type="ocultarConfirmarSenha ? 'password' : 'text'" @keyup.enter="cadastrar">
          <template #prepend>
            <q-icon name="lock" />
          </template>
          <template #append>
            <q-icon :name="ocultarConfirmarSenha ? 'visibility_off' : 'visibility'" class="cursor-pointer"
              @click="ocultarConfirmarSenha = !ocultarConfirmarSenha" />
          </template>
        </q-input>
        <q-btn color="primary" label="CADASTRAR" class="full-width q-mt-lg hover-scale" style="border-radius: 20px"
          @click="cadastrar" />
        <div class="q-mt-md flex justify-center items-center" style="width: 100%; font-size: 14px;">
          <span>Já tem um conta?</span>
          <span class="text-primary text-bold q-ml-xs cursor-pointer hover-scale" @click="voltarLogin"
            style="text-decoration: underline;">
            Entrar
          </span>
        </div>
        <div class=" q-mt-sm flex items-center justify-center"
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
import { ref } from "vue"
import { useQuasar } from "quasar"
import { useRouter } from "vue-router"
import { CadastrarUsuario } from "src/services/usuarioServices"

// Utils ---
const $q = useQuasar()
const router = useRouter()
// Refs ---
const nome = ref("")
const sobrenome = ref("")
const cpf = ref("")
const email = ref("")
const telefone = ref("")
const senha = ref("")
const confirmarSenha = ref("")
const ocultarSenha = ref(true)
const ocultarConfirmarSenha = ref(true)

// Methods ---
const voltarLogin = async () => {
  try {
    $q.loading.show({ message: 'Carregando...' })
    await router.push('/login')
    $q.loading.hide()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: 'Não foi possivel ir para o login!',
      position: 'bottom',
      timeout: 2500
    })
  } finally {
    $q.loading.hide()
  }
}

const cadastrar = async () => {
  if (!nome.value || !email.value || !telefone.value || !senha.value || !confirmarSenha.value || !cpf.value) {
    $q.notify({
      type: "warning",
      message: "Campos não preenchidos!",
      position: "bottom",
      timeout: 2500
    });
    return;
  }
  if (senha.value.length < 6) {
    $q.notify({
      type: "warning",
      message: "As senhas deve conter pelo menos 6 digitos!",
      position: "bottom",
      timeout: 2500
    });
    return;
  }
  if (senha.value !== confirmarSenha.value) {
    $q.notify({
      type: "warning",
      message: "As senhas não coincidem!",
      position: "bottom",
      timeout: 2500
    });
    return;
  }
  if (!validarEmail(email.value)) return;
  try {
    $q.loading.show({ message: "Cadastrando..." });
    const data = {
      nome: nome.value,
      sobrenome: sobrenome.value,
      email: email.value,
      telefone: telefone.value,
      senha: senha.value,
      cpf: cpf.value
    };

    const result = await CadastrarUsuario(data);

    if (!result) return;
    $q.notify({
      type: "positive",
      message: "Usuário cadastrado com sucesso!",
      position: "bottom",
      timeout: 2500
    });
    await router.push("/login");
  } finally {
    $q.loading.hide();
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
