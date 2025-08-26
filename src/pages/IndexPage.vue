<template>
  <q-page padding>
    <div class="column items-center">
      <!-- Título -->
      <div class="text-h6 text-bold text-center" style="font-size: 24px;">
        Consulte nosso Catálogo de Produtos e Garanta já os melhores!
      </div>

      <!-- Carrossel -->
      <div class="carousel-container">
        <q-carousel v-model="slide" animated navigation infinite arrows autoplay height="270px"
          class="rounded-borders shadow-2" style="max-width: 1200px; width: 100%;">
          <q-carousel-slide v-for="(img, index) in imagens" :key="index" :name="index" :img-src="img" />
        </q-carousel>
      </div>
      <q-separator color="primary" style="height: 20px;" />

    </div>

  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const slide = ref(0)
const imagens = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
]
</script>

<style scoped>
.carousel-container {
  height: 850px;
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: center;
  /* Centraliza na horizontal */
  margin-top: 16px;
  /* Espaço abaixo do header */
}

.rounded-borders {
  border-radius: 16px;
}
</style>
