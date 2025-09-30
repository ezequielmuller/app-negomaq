<template>
  <q-page padding>
    <div class="column items-center">
      <div class="carousel-container">
        <q-carousel v-model="slide" animated navigation infinite arrows autoplay height="270px"
          class="rounded-borders shadow-2" style="max-width: 1200px; width: 100%; border-radius: 20px;">
          <q-carousel-slide v-for="(img, index) in imagens" :key="index" :name="index" :img-src="img" />
        </q-carousel>
      </div>
    </div>

    <q-separator style="height: 3px;" class="q-my-sm" />

    <div class="text-h6 text-bold text-center" style="font-size: 24px;">
      Consulte nosso <span class="text-primary">Catálogo de Produtos</span> e garanta já os melhores!
    </div>
    <div class="col-12 text-bold q-mt-sm row justify-center"
      style="font-size: 22px; margin-bottom: 0px; margin-top: 24px">
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
      Novidades!</div>
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
              <q-btn color="primary" icon="add_shopping_cart" label="Adicionar" style="border-radius: 20px;" @click="props.adicionarAoCarrinho({
                id: produto.id,
                nome: produto.nome,
                descricao: produto.descricao,
                preco: `R$ ${formatarPreco(produto.preco)}`,
                img: produto.img || '/icons/faca.webp',
                qtd: 1
              })" />
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
import { ListarProdutosHome } from 'src/services/apiServices'
import type { Produto } from 'src/types/types'
import { ref, onMounted } from 'vue'

const $q = useQuasar()

const props = defineProps<{
  adicionarAoCarrinho: (produto: {
    id: string
    nome: string
    descricao: string
    preco: string
    img: string
    qtd: number
  }) => void
}>()

const produtos = ref<Produto[]>([])

const slide = ref(0)
const imagens = [
  "/src/assets/promocao-faca1.jpeg",
  "/src/assets/promocao-faca2.png",
  "/src/assets/promocao-faca3.jpg",
]

const categorias = [
  { nome: 'Facas', icone: 'restaurant', cor: 'grey', rota: 'home-facas-page' },
  { nome: 'Estojos', icone: 'takeout_dining', cor: 'grey', rota: 'home-estojo-page' },
  { nome: 'Aventais', icone: 'checkroom', cor: 'grey', rota: 'home-avental-page' },
  { nome: 'Artigos de Churrasco', icone: 'outdoor_grill', cor: 'grey', rota: 'home-artigo-churrasco-page' }
]

const listarProdutos = async () => {
  try {
    $q.loading.show({ message: 'Buscando Produtos...' })
    const result = await ListarProdutosHome()
    produtos.value = result
    $q.loading.hide()
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
function formatarPreco(preco: string | number) {
  return Number(preco).toFixed(2).replace('.', ',')
}
onMounted(async () => {
  await listarProdutos()
})
</script>

<style scoped>
.carousel-container {
  height: 300px;
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: center;
  margin-top: 16px;
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
