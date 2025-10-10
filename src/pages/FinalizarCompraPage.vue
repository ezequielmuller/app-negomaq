<template>
  <div class="q-pa-md">
    <div class="text-h6 text-bold row justify-center items-center">Finalizar Pedido</div>
    <div class=""></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const carrinho = ref([])
// const props = defineProps(['pedidoVenda'])

onMounted(() => {
  if (route.params.carrinho) {
    carrinho.value = JSON.parse(route.params.carrinho as string)
  }
  //carrinho.value
})

</script>
