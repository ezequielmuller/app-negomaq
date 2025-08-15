<template>
  <q-page padding>
    <lista-aventais :adicionarAoCarrinho="props.adicionarAoCarrinho" />

  </q-page>
</template>

<script setup lang="ts">
import ListaAventais from 'src/components/ListaAventais.vue'

const props = defineProps<{
  adicionarAoCarrinho: () => void
}>()

</script>
