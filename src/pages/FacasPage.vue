<template>
  <q-page padding>
    <div class="text-h6 text-bold text-center q-mt-sm" style="font-size: 24px;">
      Confira nossas opções de Facas
    </div>
    <lista-facas :adicionarAoCarrinho="props.adicionarAoCarrinho" />
  </q-page>
</template>

<script setup lang="ts">
import ListaFacas from 'src/components/ListaFacas.vue'
const props = defineProps<{
  adicionarAoCarrinho: () => void
}>()
</script>
