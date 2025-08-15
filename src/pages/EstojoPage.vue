<template>
  <q-page padding>
    <estojo-facas :adicionarAoCarrinho="props.adicionarAoCarrinho" />
  </q-page>
</template>

<script setup lang="ts">
import EstojoFacas from 'src/components/EstojoFacas.vue'
const props = defineProps<{
  adicionarAoCarrinho: () => void
}>()
</script>
