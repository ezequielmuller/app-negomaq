<template>
  <q-page class="flex flex-center" padding>
    <q-card style="width: 350px; height: 700px" class="flex flex-column items-center justify-center">
      <div class="flex flex-center q-mt-md" style="width: 100%; justify-content: center;">
        <img src="icons/app-logo-sfundo.png" alt="Logo da Empresa"
          style="width: 150px; height: 150px; display: block; margin: 0 auto;" />
      </div>
      <q-card-section class="flex flex-center">
        <div style="font-size: 1.5rem; font-weight: bold">
          Cadastre-se
        </div>
      </q-card-section>

      <q-card-section style="width: 100%;">
        <q-input class="full-width" label="Nome" v-model="nome">
          <template #prepend>
            <q-icon name="person" />
          </template>
        </q-input>

        <q-input class="full-width" label="Email" v-model="email">
          <template #prepend>
            <q-icon name="alternate_email" />
          </template>
        </q-input>

        <!-- Telefone com formatação correta -->
        <q-input class="full-width" label="Telefone" :model-value="telefone" @update:model-value="formatarTelefone"
          maxlength="15">
          <template #prepend>
            <q-icon name="phone" />
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

        <q-input class="full-width" label="Confirmar Senha" v-model="confirmarSenha"
          :type="ocultarConfirmarSenha ? 'password' : 'text'">
          <template #prepend>
            <q-icon name="lock" />
          </template>
          <template #append>
            <q-icon :name="ocultarConfirmarSenha ? 'visibility_off' : 'visibility'" class="cursor-pointer"
              @click="ocultarConfirmarSenha = !ocultarConfirmarSenha" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-section style="width: 100%;">
        <q-btn color="primary" label="CADASTRAR" class="full-width" style="border-radius: 10px" @click="cadastrar" />

        <div class="q-mt-md flex justify-center items-center" style="width: 100%; font-size: 14px;">
          <span>Já tem conta?</span>
          <span class="text-primary text-bold q-ml-xs cursor-pointer" @click="voltarLogin">
            Entrar
          </span>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import api from "src/services/api";

const $q = useQuasar();
const router = useRouter();

const nome = ref("");
const email = ref("");
const telefone = ref("");
const senha = ref("");
const confirmarSenha = ref("");
const ocultarSenha = ref(true);
const ocultarConfirmarSenha = ref(true);

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
      position: 'center',
      timeout: 2500
    })
  } finally {
    $q.loading.hide()
  }
}

const cadastrar = async () => {
  if (!nome.value || !email.value || !telefone.value || !senha.value || !confirmarSenha.value) {
    $q.notify({
      type: "warning",
      message: "Campos não preenchidos!",
      position: "center",
    })
    return
  }
  if (senha.value !== confirmarSenha.value) {
    $q.notify({
      type: "negative",
      message: "As senhas não coincidem!",
      position: "center",
    })
    return
  }
  try {
    $q.loading.show({ message: "Cadastrando..." });
    const payload = {
      nome: nome.value,
      email: email.value,
      telefone: telefone.value,
      senha: senha.value,
    };
    let data = {}
    data = await api.post("auth/registrar", payload);
    console.log(data)
    $q.loading.hide();
  } catch (error) {
    console.log(error)
    $q.notify({
      type: "negative",
      message: "Não foi possível realizar o cadastro!",
      position: "center",
    })
  } finally {
    $q.loading.hide();
  }
}

// Mounted
onMounted(() => {
  console.log('Tela carregada!')
})
</script>
