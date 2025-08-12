<template>
  <q-page class="flex flex-center" padding>
    <q-card style="width: 350px; height: 650px" class="flex flex-column items-center justify-center">
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
          :type="ocultarSenha ? 'password' : 'text'">
          <template #prepend>
            <q-icon name="lock" />
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
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();

const nome = ref("");
const email = ref("");
const senha = ref("");
const confirmarSenha = ref("");
const ocultarSenha = ref(true);

const voltarLogin = async () => {
  await router.push("/");
};

const cadastrar = async () => {
  if (!nome.value || !email.value || !senha.value || !confirmarSenha.value) {
    $q.notify({
      type: "warning",
      message: "Preencha todos os campos",
      position: "center",
    });
    return;
  }
  if (senha.value !== confirmarSenha.value) {
    $q.notify({
      type: "negative",
      message: "As senhas não coincidem",
      position: "center",
    });
    return;
  }

  try {
    $q.loading.show({ message: "Cadastrando..." });

    // Simula chamada async (ex: API)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    $q.loading.hide();
    $q.notify({
      type: "positive",
      message: "Cadastro realizado com sucesso!",
      position: "center",
    });

    await voltarLogin();

  } catch (error) {
    console.error("Erro ao cadastrar => ", error);
    $q.notify({ type: "negative", message: "Erro ao cadastrar", position: "center" });
    $q.loading.hide();
  }
};
</script>
