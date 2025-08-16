<template>
  <q-page padding>
    <artigos-churrasco :adicionarAoCarrinho="props.adicionarAoCarrinho" />

  </q-page>
</template>
<script setup lang="ts">
import ArtigosChurrasco from 'src/components/ArtigosChurrasco.vue'

const props = defineProps<{
  adicionarAoCarrinho: () => void
}>()

</script>
