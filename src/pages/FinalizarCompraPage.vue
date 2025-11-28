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
      <div class="text-h6 text-bold row justify-center items-center">Finalizar Pedido</div>
      <div class="q-pa-md">
        <q-stepper v-model="step" header-nav ref="stepper" color="primary" animated :vertical="$q.screen.lt.md">
          <!-- REVISAR PDV-->
          <q-step :name="1" title="Revisar Itens" icon="shopping_cart" :done="step > 1" :header-nav="step > 1">
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
                      <q-btn flat dense round color="negative" icon="delete" @click="removerProdCarrinho(item)" />
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
          <!-- ENDEREÇO DE ENTREGA-->
          <q-step :name="2" title="Endereço" icon="house" :done="step > 2" :header-nav="step > 2">
            <div>
              <SelecionarEndereco :usuarioId="usuarioId" @endereco-selecionado="enderecSelecionado = $event" />
            </div>
            <q-stepper-navigation>
              <div class="row justify-end q-mt-md q-gutter-sm">
                <q-btn flat @click="step = 1" color="primary" label="Voltar" class="hover-scale"
                  style="border-radius: 20px;" />
                <q-btn :disable="!enderecSelecionado" @click="irParaPagamento" color="primary" label="Continuar"
                  class="hover-scale" style="border-radius: 20px;" />
              </div>
            </q-stepper-navigation>
          </q-step>
          <!-- FRETE E PAGAMENTO -->
          <q-step :name="3" title="Revisar Pedido" icon="payments" :done="step > 3" :header-nav="step > 3">
            <div class="q-mt-md">
              <div class="text-h6 text-bold q-mb-md">Resumo do Pedido</div>
              <!-- Endereco selecionado -->
              <div class="q-pa-md bg-red-1 q-mb-md" style="border-radius: 12px; border: 1px solid #b81414;">
                <div class="text-bold q-mb-sm">Endereço de Entrega:</div>
                <div class="text-body2">
                  {{ enderecSelecionado?.logradouro }}, {{ enderecSelecionado?.numero }}
                </div>
                <div v-if="enderecSelecionado?.complemento" class="text-body2">
                  {{ enderecSelecionado.complemento }}
                </div>
                <div class="text-body2">
                  {{ enderecSelecionado?.bairro }}, {{ enderecSelecionado?.cidade }} - {{ enderecSelecionado?.estado }}
                </div>
                <div class="text-caption text-grey-7">
                  CEP: {{ formatarCEP(enderecSelecionado?.cep || '') }}
                </div>
              </div>
              <!-- Opções de Frete -->
              <div class="q-mb-md">
                <div class="text-bold q-mb-sm">Selecione uma opção de frete:</div>
                <div v-if="fretes.length === 0" class="q-pa-md bg-warning text-white" style="border-radius: 12px;">
                  <q-icon name="warning" size="md" class="q-mr-sm" />
                  <span>Nenhuma opção de frete disponível para este endereço</span>
                </div>
                <div v-else class="q-gutter-md">
                  <q-card v-for="frete in fretes" :key="frete.id" bordered
                    :class="{ 'bg-green-1': fretesSelecionado?.id === frete.id }"
                    class="cursor-pointer hover-card q-pa-md" style="border-radius: 12px;"
                    @click="selecionarFrete(frete)">
                    <div class="row items-center">
                      <q-radio :model-value="fretesSelecionado?.id" :val="frete.id"
                        @update:model-value="selecionarFrete(frete)" />
                      <div class="col q-ml-md">
                        <div class="text-bold">{{ frete.transportadora }} - {{ frete.servico }}</div>
                        <div class="text-caption text-grey-7">Prazo: {{ frete.prazo_dias }} dias úteis</div>
                        <div class="text-body2 text-primary text-bold q-mt-xs">
                          {{ formatCurrency(frete.preco) }}
                        </div>
                      </div>
                    </div>
                  </q-card>
                </div>
              </div>
              <!-- Resumo de valores -->
              <q-card class="q-pa-md" style="border-radius: 12px;">
                <div class="row justify-between q-mb-sm">
                  <span>Subtotal:</span>
                  <span class="text-bold">{{ formatCurrency(totalCarrinho) }}</span>
                </div>
                <q-separator class="q-my-sm" />
                <div class="row justify-between q-mb-sm">
                  <span>Frete:</span>
                  <span class="text-bold text-primary">
                    {{ fretesSelecionado ? formatCurrency(fretesSelecionado.preco) : 'Selecione um frete' }}
                  </span>
                </div>
                <q-separator class="q-my-sm" />
                <div class="row justify-between">
                  <span class="text-bold" style="font-size: 16px;">Total:</span>
                  <span class="text-bold text-primary" style="font-size: 16px;">
                    {{ formatCurrency(totalComFrete) }}
                  </span>
                </div>
              </q-card>
              <q-stepper-navigation>
                <div class="flex row justify-end q-mt-md q-gutter-sm">
                  <q-btn flat @click="step = 2" color="primary" label="Voltar" class="hover-scale"
                    style="border-radius: 20px;" />
                  <q-btn :disable="!fretesSelecionado" color="primary" label="Continuar para Pagamento"
                    @click="irParaFinalizacao" class="hover-scale" style="border-radius: 20px;" />
                </div>
              </q-stepper-navigation>
            </div>
          </q-step>
          <!-- PAGAMENTO -->
          <q-step :name="4" title="Pagamento" icon="credit_card">
            <div class="q-mt-md">
              <div class="text-h6 text-bold q-mb-md">Finalizar Pagamento</div>

              <!-- Resumo Final -->
              <q-card class="q-pa-md q-mb-md" style="border-radius: 12px;">
                <div class="text-bold q-mb-md">Resumo da Compra</div>
                <div class="row justify-between q-mb-sm">
                  <span>Subtotal dos produtos:</span>
                  <span>{{ formatCurrency(totalCarrinho) }}</span>
                </div>
                <div class="row justify-between q-mb-sm">
                  <span>Frete ({{ fretesSelecionado?.servico }}):</span>
                  <span>{{ formatCurrency(fretesSelecionado?.preco || 0) }}</span>
                </div>
                <q-separator class="q-my-md" />
                <div class="row justify-between">
                  <span class="text-bold text-h6">Total a pagar:</span>
                  <span class="text-bold text-h6 text-primary">
                    {{ formatCurrency(totalComFrete) }}
                  </span>
                </div>
              </q-card>

              <!-- Método de Pagamento -->
              <q-card class="q-pa-md q-mb-md" style="border-radius: 12px;">
                <div class="text-bold q-mb-md">Método de Pagamento</div>
                <div class="row items-center q-pa-md bg-blue-1" style="border-radius: 8px;">
                  <q-icon name="payment" size="md" color="primary" class="q-mr-md" />
                  <div class="col">
                    <div class="text-bold">Mercado Pago</div>
                    <div class="text-caption text-grey-7">
                      Pagamento seguro via Mercado Pago
                    </div>
                    <div class="text-caption text-grey-7">
                      Cartão de crédito, débito, Pix e mais
                    </div>
                  </div>
                  <q-icon name="credit_score" size="md" color="grey-6" />
                </div>
              </q-card>

              <!-- Informações de Segurança -->
              <q-banner class="bg-grey-2 q-mb-md" style="border-radius: 12px;">
                <template v-slot:avatar>
                  <q-icon name="lock" color="positive" />
                </template>
                <div class="text-caption">
                  Seus dados estão protegidos. O pagamento é processado de forma segura pelo Mercado Pago.
                </div>
              </q-banner>

              <q-stepper-navigation>
                <div class="row justify-end q-gutter-sm">
                  <q-btn flat @click="step = 3" color="primary" label="Voltar" class="hover-scale"
                    style="border-radius: 20px;" />
                  <q-btn color="positive" label="Finalizar e Ir para Pagamento" icon-right="arrow_forward"
                    @click="finalizarCompra" :loading="processandoPagamento" class="hover-scale"
                    style="border-radius: 20px;" />
                </div>
              </q-stepper-navigation>
            </div>
          </q-step>
        </q-stepper>
      </div>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useCartStore } from 'src/stores/useCartStore'
import { useAuth } from 'src/composables/useAuth'
import SelecionarEndereco from 'src/components/FinalizarCompra/SelecionarEndereco.vue'
import {
  CalcularFrete,
  CriarPedido,
  CriarPagamento,
  type CriarPedidoPayload,
  type ItemPedido,
  type FretePagamento,
  type CriarPagamentoPayload
} from 'src/services/pedidoServices'
import type { Produto, Endereco, Usuario } from 'src/types/types'
import { formatPrice } from 'src/config/formatPrice'
import { useRouter } from 'vue-router'

// Utils ---
const router = useRouter()
const storeCart = useCartStore()
const { getUser } = useAuth()
const user = getUser() as Usuario
const $q = useQuasar()

// Refs ---
const step = ref(1)
const dialogVerificacaoCarrinho = ref(false)
const enderecSelecionado = ref<Endereco | null>(null)
const fretes = ref<FreteUI[]>([])
const fretesSelecionado = ref<FreteUI | null>(null)
const pedidoCriado = ref<string | null>(null)
const processandoPagamento = ref(false)

// Tipos ---
interface FreteUI {
  id: number
  prazo_dias: number
  prazo_max: number
  prazo_min: number
  preco: number
  servico: string
  transportadora: string
}

// Computed ---
const pedidoVenda = computed(() => storeCart.carrinho)
const usuarioId = computed(() => user?.id || '')
const totalCarrinho = computed(() =>
  storeCart.carrinho.reduce((sum, item) => sum + item.preco * (item.qtd ?? 1), 0)
)
const totalComFrete = computed(() => {
  if (!fretesSelecionado.value) return totalCarrinho.value
  return totalCarrinho.value + fretesSelecionado.value.preco
})

// Watch ---
watch(() => pedidoVenda.value.length, (novoTamanho) => {
  dialogVerificacaoCarrinho.value = novoTamanho <= 0
}, { immediate: true })

// Methods ---
const removerProdCarrinho = (item: Produto) => {
  storeCart.removerDoCarrinho(item.id)
}

const diminuirQtd = (item: Produto) => {
  if ((item.qtd ?? 1) > 1) item.qtd!--
  else removerProdCarrinho(item)
}

const irParaPagamento = async () => {
  if (!enderecSelecionado.value) {
    $q.notify({
      type: 'warning',
      message: 'Selecione um endereço',
      timeout: 2000,
      position: 'bottom'
    })
    return
  }
  try {
    $q.loading.show({ message: 'Calculando fretes...' })
    fretes.value = []
    fretesSelecionado.value = null
    const itens: ItemPedido[] = storeCart.carrinho.map((it) => ({
      produto_id: it.id,
      quantidade: it.qtd ?? 1
    }))
    const response = await CalcularFrete({ usuario_id: user.id, itens }, user.token)
    if (response?.opcoes && response.opcoes.length > 0) {
      fretes.value = response.opcoes
      step.value = 3
    } else {
      $q.notify({
        type: 'warning',
        message: 'Nenhuma opção de frete disponível para este endereço',
        timeout: 2000,
        position: 'bottom'
      })
    }
  } catch (err) {
    console.error('Erro ao calcular frete:', err)
    $q.notify({
      type: 'negative',
      message: 'Erro ao calcular opções de frete',
      timeout: 2000,
      position: 'bottom'
    })
  } finally {
    $q.loading.hide()
  }
}

const selecionarFrete = (frete: FreteUI) => {
  fretesSelecionado.value = frete
}

const irParaFinalizacao = async () => {
  if (!fretesSelecionado.value) {
    $q.notify({
      type: 'warning',
      message: 'Selecione uma opção de frete',
      timeout: 2000,
      position: 'bottom'
    })
    return
  }
  try {
    $q.loading.show({ message: 'Criando pedido...' })
    const itens: ItemPedido[] = storeCart.carrinho.map(item => ({
      produto_id: item.id,
      quantidade: item.qtd ?? 1
    }))
    const frete: FretePagamento = {
      valor: fretesSelecionado.value.preco,
      tipo: fretesSelecionado.value.transportadora,
      servico_id: fretesSelecionado.value.id,
      servico: fretesSelecionado.value.servico
    }
    const payloadPedido: CriarPedidoPayload = {
      usuario_id: user.id,
      endereco_id: enderecSelecionado.value?.id || '',
      itens: itens,
      frete: frete
    }
    const resultado = await CriarPedido(payloadPedido, user.token)
    if (!resultado || !resultado.pedido_id) {
      throw new Error('Erro ao criar pedido')
    }
    pedidoCriado.value = resultado.pedido_id
    step.value = 4
    $q.notify({
      type: 'positive',
      message: 'Pedido criado! Finalize o pagamento.',
      timeout: 2000,
      position: 'bottom'
    })
  } catch (err) {
    console.error('Erro ao criar pedido:', err)
    $q.notify({
      type: 'negative',
      message: 'Erro ao criar pedido. Tente novamente.',
      timeout: 3000,
      position: 'bottom'
    })
  } finally {
    $q.loading.hide()
  }
}

const finalizarCompra = async () => {
  if (!pedidoCriado.value) {
    $q.notify({
      type: 'negative',
      message: 'Erro: Pedido não foi criado corretamente',
      timeout: 2000,
      position: 'bottom'
    })
    return
  }
  try {
    processandoPagamento.value = true
    $q.loading.show({ message: 'Gerando link de pagamento...' })
    const payloadPagamento: CriarPagamentoPayload = {
      pedido_id: pedidoCriado.value,
      metodo: 'mercado_pago'
    }
    const resultadoPagamento = await CriarPagamento(payloadPagamento, user.token)
    if (!resultadoPagamento) {
      throw new Error('Erro ao criar pagamento')
    }
    const linkPagamento = resultadoPagamento.checkout_url
    if (!linkPagamento) {
      console.error('Resposta do pagamento:', resultadoPagamento)
      throw new Error('Link de pagamento não foi retornado pela API')
    }
    console.log('Link de pagamento recebido:', linkPagamento)
    $q.notify({
      type: 'positive',
      message: 'Redirecionando para o Mercado Pago...',
      timeout: 2000,
      position: 'bottom'
    })
    storeCart.limparCarrinho()
    await router.push('/home-user-page')
  } catch (err) {
    console.error('Erro ao processar pagamento:', err)
    $q.notify({
      type: 'negative',
      message: 'Erro ao processar pagamento. Tente novamente.',
      timeout: 3000,
      position: 'bottom'
    })
  } finally {
    processandoPagamento.value = false
    $q.loading.hide()
  }
}

// metodos uteis ---
const formatCurrency = (value: number) => {
  return formatPrice(value)
}
const formatarCEP = (cep: string): string => {
  if (!cep) return ''
  const apenasNumeros = cep.replace(/\D/g, '')
  if (apenasNumeros.length === 8) {
    return `${apenasNumeros.slice(0, 5)}-${apenasNumeros.slice(5)}`
  }
  return cep
}
</script>
<style scoped>
.hover-scale {
  transition: transform 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}

.hover-card {
  transition: all 0.3s ease;
}

.hover-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.cursor-pointer {
  cursor: pointer;
}
</style>
