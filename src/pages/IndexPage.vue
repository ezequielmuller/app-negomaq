<template>
  <q-page padding>
    <div class="text-h6 text-bold text-center" style="font-size: 24px;">
      Consulte nosso Catálogo de Produtos e Garanta já os melhores!
    </div>

    <div class="column items-center">
      <div class="carousel-container">
        <q-carousel v-model="slide" animated navigation infinite arrows autoplay height="270px"
          class="rounded-borders shadow-2" style="max-width: 1200px; width: 100%; border-radius: 20px;">
          <q-carousel-slide v-for="(img, index) in imagens" :key="index" :name="index" :img-src="img" />
        </q-carousel>
      </div>
    </div>

    <q-separator style="height: 3px;" class="q-my-sm" />

    <div v-if="produtos.length > 0" class="row justify-center q-col-gutter-md q-mt-sm">
      <div v-for="produto in produtos" :key="produto.id" class="col-12 col-sm-4 col-md-4 q-mb-md"
        style="max-width: 320px;">
        <q-card class="hover-scale" style="border-radius: 20px; display: flex; flex-direction: column; height: 100%;">
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
              <q-btn color="primary" icon="add_shopping_cart" label="Adicionar" class="hover-scale"
                style="border-radius: 20px;" @click="props.adicionarAoCarrinho({
                  nome: produto.nome,
                  descricao: produto.descricao,
                  preco: `R$ ${formatarPreco(produto.preco)}`,
                  img: produto.img || '/icons/faca.webp'
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
import { ListarProdutosHome } from 'src/services/produtoService'
import type { Produto } from 'src/types/types'
import { ref, onMounted } from 'vue'

const $q = useQuasar()

const props = defineProps<{
  adicionarAoCarrinho: (produto: {
    nome: string
    descricao: string
    preco: string
    img: string
  }) => void
}>()

const produtos = ref<Produto[]>([])
const slide = ref(0)
const imagens = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
]

const listarProdutos = async () => {
  try {
    $q.loading.show({ message: 'Buscando Produtos...' })
    const result = await ListarProdutosHome()
    console.log(result.data)
    produtos.value = result
    $q.loading.hide()
  } catch (error) {
    console.log("Erro==> ", error)
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
  /* Centraliza na horizontal */
  margin-top: 16px;
  /* Espaço abaixo do header */
}

.rounded-borders {
  border-radius: 16px;
}
</style>
