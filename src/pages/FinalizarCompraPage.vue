<template>
  <q-page padding>
    <div v-if="pedidoVenda.length <= 0">
      <q-dialog v-model="dialogVerificacaoCarrinho" persistent>
        <q-card style="width: 100%; max-width: 300px;">
          <div class="column justify-center">
            <div class="row justify-center q-pt-lg q-px-lg">
              <q-icon size="xl" color="primary" name="production_quantity_limits" />
            </div>
            <div style="font-size: 18px;" class="q-px-lg q-pb-md text-bold row justify-center">
              Carrinho vazio!
            </div>
            <q-separator class="" />
            <div class="row justify-center q-mt-sm q-px-lg q-pb-sm">
              <q-btn color="primary" label="Voltar ao início!" to="/home" />
            </div>
          </div>
        </q-card>
      </q-dialog>
    </div>
    <div v-else>
      <div class=" text-h6 text-bold row justify-center items-center">Finalizar Pedido</div>
      <div class="q-pa-md">
        <q-stepper v-model="step" header-nav ref="stepper" color="primary" animated :vertical="$q.screen.lt.md">

          <q-step :name="1" title="Revisar Pedido" icon="shopping_cart" :done="step > 1" :header-nav="step > 1">
            <div v-if="pedidoVenda.length > 0">
              <q-list class="q-pa-sm">
                <q-item v-for="(item, index) in pedidoVenda" :key="index" class="q-pa-sm"
                  style="border-radius: 12px; margin-bottom: 10px; border: 1px solid #e0e0e0;">
                  <q-item-section avatar>
                    <img :src="item.img || ''" :alt="item.nome"
                      style="width: 80px; height: 80px; border-radius: 12px; object-fit: cover;" />
                  </q-item-section>
                  <q-item-section>
                    <div class="text-bold text-dark" style="font-size: 16px;">{{ item.nome }}</div>
                    <div class="text-grey-7">{{ item.descricao }}</div>
                    <div class="text-bold text-primary q-mt-xs" style="font-size: 16px;">
                      {{ formatCurrency(item.preco) }}
                    </div>
                    <div class="row items-center q-gutter-sm q-mt-sm">
                      <q-btn flat dense round color="primary" icon="remove" @click="diminuirQtd(item)" />
                      <span class="text-bold">{{ item.qtd }}</span>
                      <q-btn flat dense round color="primary" icon="add" @click="item.qtd = (item.qtd ?? 1) + 1" />
                      <q-space />
                      <q-btn flat dense round color="negative" icon="delete" @click="removerDoCarrinho(item)" />
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
              <div class="row justify-between items-center q-mt-md q-pa-md bg-grey-2" style="border-radius: 12px;">
                <div class="text-bold" style="font-size: 17px;">Total:</div>
                <div class="text-primary text-bold" style="font-size: 17px;">
                  {{ formatCurrency(totalCarrinho) }}
                </div>
              </div>

              <q-stepper-navigation>
                <div class="row justify-end q-mt-md">
                  <q-btn color="primary" label="Continuar" @click="step = 2" class="hover-scale"
                    style="border-radius: 20px;" />
                </div>
              </q-stepper-navigation>
            </div>

            <div v-else class="text-center q-pa-lg text-grey">
              <q-icon name="shopping_bag" size="64px" class="q-mb-sm" />
              <div class="text-h6">Seu carrinho está vazio</div>
            </div>
          </q-step>

          <q-step :name="2" title="Endereço" icon="house" :done="step > 2" :header-nav="step > 2">
            An ad group contains one or more ads which target a shared set of keywords.

            <q-stepper-navigation>
              <q-btn @click="() => { step = 3 }" color="primary" label="Continue" />
              <q-btn flat @click="step = 1" color="primary" label="Back" class="q-ml-sm" />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="3" title="Pagamento" icon="payments" :header-nav="step > 3">
            Try out different ad text to see what brings in the most customers, and learn how to
            enhance your ads using features like ad extensions. If you run into any problems with
            your ads, find out how to tell if they're running and how to resolve approval issues.

            <q-stepper-navigation>
              <q-btn color="primary" label="Finish" />
              <q-btn flat @click="step = 2" color="primary" label="Back" class="q-ml-sm" />
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
      </div>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useCartStore } from 'src/stores/useCartStore'
import type { Produto } from 'src/types/types'
import { formatPrice } from 'src/config/formatPrice'
// Store ---
const storeCart = useCartStore()
const pedidoVenda = computed(() => storeCart.carrinho)
// Variaveis---
const step = ref(1)
const dialogVerificacaoCarrinho = ref(false)
// Computed ---
const totalCarrinho = computed(() =>
  storeCart.carrinho.reduce((sum, item) => sum + item.preco * (item.qtd ?? 1), 0)
)
// Watch ---
watch(() => pedidoVenda.value.length, (novoTamanho) => {
  dialogVerificacaoCarrinho.value = novoTamanho <= 0
},
  { immediate: true }
)
// Methods---
const removerDoCarrinho = (item: Produto) => {
  storeCart.removerDoCarrinho(item.id)
}
const diminuirQtd = (item: Produto) => {
  if ((item.qtd ?? 1) > 1) item.qtd!--
  else removerDoCarrinho(item)
}
// metodos uteis ---
function formatCurrency(value: number) {
  return formatPrice(value)
}
</script>
