<template>
  <q-page padding>
    <div class="text-h6 flex flex-center text-bold text-center">
      Consulte nosso Catálogo de Produtos e Garanta já os melhores!
    </div>

    <!-- CARROSSEL DE IMAGENS -->
    <div class="q-pa-none">
      <q-carousel v-model="slide" animated infinite autoplay swipeable transition-prev="slide-right"
        transition-next="slide-left" navigation arrows class="my-carousel">
        <q-carousel-slide v-for="(img, index) in images" :key="index" :name="index" :img-src="img"
          class="carousel-img" />
      </q-carousel>
    </div>

  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// const props = defineProps<{
//   adicionarAoCarrinho: () => void
// }>()

// Carrossel - imagens
const slide = ref(0)
const images = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
];

</script>


<!-- Configurações para telas menores-->
<style scoped>
/* .input-pesquisa {
  width: 700px;
  max-width: 90vw;
}

@media (max-width: 600px) {
  .input-pesquisa {
    width: 300px;
  }
} */

.my-carousel {
  width: 100%;
  height: 160px;
  /* altura mais compacta */
}

.carousel-img img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  border-radius: 0;
  /* remove arredondamento para ficar colado ao header */
}
</style>
