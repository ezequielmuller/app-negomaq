<template>
  <div class="text-h6 flex flex-center text-bold text-center">
    Estojo de Facas
  </div>
  <div class="flex flex-center q-mt-md">
    <q-input flat v-model="pesquisa" label="Pesquise por Produtos!" class="input-pesquisa">
      <template #prepend>
        <q-icon name="search" />
      </template>
    </q-input>
  </div>
  <q-separator class="q-mt-md q-mb-mt" color="primary" style="height: 3px;" />

  <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 16px;">
    <q-card v-for="i in 5" :key="i" class="q-mt-md" style=" width: 350px;
      max-width: 95vw;
      min-width: 220px;
      display: flex;
      flex-direction: column;">

      <q-card-section style="display: flex; justify-content: center; align-items: center; padding-bottom: 0;">
        <img src="icons/estojo.webp" alt="estojo" style="width: 90%;
        max-width: 250px;
        height: auto;
        object-fit: contain;
        border-radius: 10px;
        box-shadow: 0 2px 8px #0001;" />
      </q-card-section>

      <q-card-section>
        <div class="row justify-between">
          <div style="font-size: 18px;" class="text-bold">
            Estojo em Couro - Personalizado
          </div>
          <div class="q-mt-md" style="font-size: 14px;">
            Uma ótima opção de estojo para facas para usar na cozinha da sua casa! <b>EM COURO</b> e
            <b>Personalizada</b>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="row items-center justify-between">
          <div style="font-size: 18px;" class="text-bold q-ml-md">
            R$ 49,99
          </div>
          <q-btn color="primary" icon="add_shopping_cart" label="Adicionar" style="border-radius: 10px"
            @click="props.adicionarAoCarrinho()" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{
  adicionarAoCarrinho: () => void
}>()
const pesquisa = ref(null)
</script>
<!-- Configurações para telas menores-->
<style scoped>
.input-pesquisa {
  width: 700px;
  max-width: 90vw;
}

@media (max-width: 600px) {
  .input-pesquisa {
    width: 300px;
  }
}
</style>
