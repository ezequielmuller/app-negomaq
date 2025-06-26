<template>
  <div class="text-h6 flex flex-center text-bold">
    Facas
  </div>
  <div class="flex flex-center q-mt-md">
    <q-input flat v-model="pesquisa" label="Pesquise por Produtos!" style="width: 700px; max-width: 90vw;">
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
        <img src="icons/faca.webp" alt="Faca" style="width: 90%;
        max-width: 250px;
        height: auto;
        object-fit: contain;
        border-radius: 10px;
        box-shadow: 0 2px 8px #0001;" />
      </q-card-section>

      <q-card-section>
        <div class="row justify-between">
          <div style="font-size: 18px;" class="text-bold">
            Faca de Cozinha - Personalizada
          </div>
          <div class="q-mt-md" style="font-size: 14px;">
            Uma ótima opção de faca para usar na cozinha da sua casa! Personalizada com a logo da Skol
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="row items-center justify-between">
          <div style="font-size: 18px;" class="text-bold q-ml-md">
            R$ 75,99
          </div>
          <q-btn color="primary" icon="add_shopping_cart" label="Adicionar" style="border-radius: 10px" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const pesquisa = ref(null)
</script>
