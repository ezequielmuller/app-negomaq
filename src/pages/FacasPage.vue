<template>
  <q-page padding>
    <lista-facas :adicionarAoCarrinho="props.adicionarAoCarrinho" />
  </q-page>
</template>

<script setup lang="ts">
import ListaFacas from 'src/components/ListaFacas.vue'
const props = defineProps<{
  adicionarAoCarrinho: () => void
}>()
</script>
