<template>
  <q-page padding>
    <div class="column items-center">
      <div class="carousel-container">
        <q-carousel v-model="slide" animated infinite arrows autoplay class="carousel-responsive shadow-2">
          <q-carousel-slide v-for="(img, index) in imagens" :key="index" :name="index" class="carousel-slide">
            <div class="slide-bg" :style="{ backgroundImage: `url(${img})` }"></div>
            <img :src="img" alt="promoção" class="slide-img" />
          </q-carousel-slide>
        </q-carousel>
      </div>
    </div>
    <q-separator style="height: 3px;" spaced />
    <div class="text-h6 text-bold text-center q-mt-sm" style="font-size: 24px;">
      Consulte nosso <span class="text-primary">Catálogo de Produtos</span> e garanta já os melhores!
    </div>
    <div class="col-12 text-bold q-mt-md row justify-center" style="font-size: 22px; margin-bottom: 0px;">
      Categorias</div>
    <div class="row justify-center q-col-gutter-md categorias-container" style="margin-top: 0;">
      <div class="col-xs-12 col-sm-6 col-md-3" v-for="cat in categorias" :key="cat.nome" style="margin-top: 0;">
        <q-card class="categoria-card flex column items-center cursor-pointer"
          style="border-radius: 20px; margin-top: 0;" @click="$router.push(cat.rota)">
          <div class=" icone"><q-icon :color="cat.cor" :name="cat.icone" size="80px" /></div>
          <div class="text-grey text-bold text-h6">{{ cat.nome }}</div>
        </q-card>
      </div>
    </div>
    <div class="col-12 text-bold q-mb-lg q-mt-sm row justify-center" style="font-size: 22px; margin-bottom: 14px;">
      Novidades!
    </div>
    <div v-if="produtos.length > 0" class="row justify-center q-col-gutter-md">
      <div v-for="produto in produtos.slice(0, 3)" :key="produto.id" class="col-12 col-sm-6 col-md-4 q-mb-md"
        style="max-width: 320px;">
        <q-card class="produto-card" style="border-radius: 20px; display: flex; flex-direction: column; height: 100%;">
          <q-card-section class="flex justify-center items-center" style="height: 200px;">
            <img :src="produto.img || '/icons/estojo.webp'" :alt="produto.nome"
              class="w-auto max-w-full h-full object-contain rounded-[10px] shadow-md" />
          </q-card-section>
          <q-separator class="q-mx-md" />
          <q-card-section class="flex flex-col flex-1">
            <div class="text-bold" style="font-size: 21px;">{{ produto.nome }}</div>
            <div class="q-mt-sm" style="font-size: 14px;">{{ produto.descricao }}</div>

            <div class="row items-center justify-between q-mt-auto q-pt-sm">
              <div class="text-bold text-primary" style="font-size: 21px;">
                R$ {{ formatarPreco(produto.preco) }}
              </div>
              <q-btn color="primary" icon="add_shopping_cart" label="Adicionar" style="border-radius: 20px;"
                @click="adicionarNoCarrinho(produto)" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div v-else class="text-center text-grey q-mt-md flex flex-col justify-center items-center">
      <q-icon name="error" size="xl" color="grey" />
      <span class="font-bold q-mt-sm">Nenhum produto encontrado!</span>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { useQuasar } from 'quasar'
import { ListarProdutosHome } from 'src/services/produtoServices'
import { useCartStore } from 'src/stores/useCartStore'
import { ref, onMounted } from 'vue'
import type { Produto } from 'src/types/types'

//Utils ---
const $q = useQuasar()
const store = useCartStore()
// Refs ---
const produtos = ref<Produto[]>([])
const slide = ref(0)
const imagens = [
  "/src/assets/banner1.jpg",
  "/src/assets/banner2.jpeg",
  "/src/assets/banner3.jpeg",
]
const categorias = [
  { nome: 'Facas', icone: 'restaurant', cor: 'grey', rota: 'home-facas-page' },
  { nome: 'Estojos', icone: 'takeout_dining', cor: 'grey', rota: 'home-estojo-page' },
  { nome: 'Aventais', icone: 'checkroom', cor: 'grey', rota: 'home-avental-page' },
  { nome: 'Artigos de Churrasco', icone: 'outdoor_grill', cor: 'grey', rota: 'home-artigo-churrasco-page' }
]

// Methods ---
const adicionarNoCarrinho = (produto: Produto) => {
  if (store.adicionarAoCarrinho) {
    store.adicionarAoCarrinho(produto)
    $q.notify({
      type: 'positive',
      message: `${produto.nome} adicionado ao carrinho!`,
      position: 'bottom',
      timeout: 1500
    })
  } else {
    console.warn('Método adicionarAoCarrinho não encontrado na store.')
  }
}

const listarProdutos = async () => {
  try {
    $q.loading.show({ message: 'Buscando Produtos...' })
    const result = await ListarProdutosHome()
    produtos.value = Array.isArray(result) ? result : []
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      position: 'bottom',
      message: 'Erro ao buscar Produtos!',
      timeout: 2000
    })
  } finally {
    $q.loading.hide()
  }
}

// Metodos uteis ---
function formatarPreco(preco: string | number) {
  return Number(preco).toFixed(2).replace('.', ',')
}


onMounted(async () => {
  await listarProdutos()
})
</script>
<style scoped>
.carousel-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 16px;
}

.carousel-responsive {
  width: 100%;
  height: auto;
  aspect-ratio: 21 / 9;
  margin: 16px 0;
  border-radius: 16px;
  overflow: visible;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  /* garante que controles fiquem posicionados corretamente */
}

.carousel-slide {
  position: relative;
  overflow: hidden;
  height: 100%;
}

.slide-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: blur(20px) brightness(0.7);
  transform: scale(1.2);
  z-index: 1;
  pointer-events: none;
  /* evita que o background intercepts cliques nas setas */
}

.slide-img {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 2;
  padding: 16px;
}

.slide-img {
  border-radius: 12px;
  /* bordas arredondadas na própria imagem */
  background-color: transparent;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

/* garante que o wrapper com borda arredondada esconda excessos
   enquanto o carrossel interno pode mostrar controles além da área */
.carousel-container {
  border-radius: 16px;
  overflow: hidden;
}

/* Força as setas do Quasar a aparecerem na frente e permitirem cliques */
.carousel-responsive :deep(.q-carousel__arrow) {
  z-index: 1000;
  pointer-events: auto;
}



/* Ajustes responsivos */
@media (max-width: 1024px) {
  .carousel-responsive {
    aspect-ratio: 16 / 10;
  }
}

@media (max-width: 768px) {
  .carousel-responsive {
    aspect-ratio: 3 / 2;
  }

  .slide-img {
    padding: 12px;
  }
}

@media (max-width: 600px) {
  .carousel-container {
    padding: 0 8px;
  }

  .carousel-responsive {
    aspect-ratio: 4 / 3;
    margin: 8px 0;
  }

  .slide-img {
    padding: 8px;
  }
}

.rounded-borders {
  border-radius: 16px;
}

/* Centraliza as categorias e limita largura */
.categorias-container {
  max-width: 1200px;
  margin: 0 auto 24px auto;
  width: 100%;
}

.categoria-card,
.produto-card {
  border: 1mm solid gainsboro;
  transition: box-shadow 0.2s, border-color 0.2s, transform 0.15s, color 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-radius: 20px;
}

/* Hover geral dos cards */
.categoria-card:hover,
.produto-card:hover {
  border-color: var(--q-primary);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.13);
  z-index: 2;
  transform: translateY(-4px) scale(1.05);
}

/* Ícone e texto dentro da categoria ficam vermelhos no hover */
.categoria-card:hover .icone,
.categoria-card:hover .text-h6 {
  color: var(--q-primary) !important;
}
</style>
