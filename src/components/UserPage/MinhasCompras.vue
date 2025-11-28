<template>
  <q-card class="q-pa-md shadow-1" style="border-radius: 16px;">
    <div class="row items-center q-mb-md">
      <q-icon name="shopping_bag" size="md" color="primary" class="q-mr-sm" />
      <div style="font-size: 19px;" class="text-bold">Minhas Compras</div>
      <q-space />
      <q-btn flat dense icon="refresh" @click="carregarPedidos" :loading="carregando" color="primary" />
    </div>
    <q-separator class="q-mb-md" />
    <!-- Sem pedidos -->
    <div v-if="pedidos.length === 0" class="text-center q-pa-lg text-grey-6">
      <q-icon name="shopping_cart" size="64px" />
      <div class="text-h6 q-mt-md">Você ainda não realizou nenhuma compra</div>
      <q-btn label="Ir para loja" color="primary" icon="store" class="q-mt-md hover-scale" to="/home"
        style="border-radius: 20px;" />
    </div>
    <!-- Lista de pedidos -->
    <div v-else class="column q-gutter-md">
      <q-expansion-item v-for="pedido in pedidos" :key="pedido.pedido_id" class="pedido-card"
        style="border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(26, 35, 126, 0.12); border: none; background: white; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
        <template v-slot:header>
          <div class="full-width">
            <div class="row items-center justify-between q-pa-xs">
              <div class="col-auto">
                <div class="text-weight-bold text-primary" style="font-size: 18px;">
                  Pedido #{{ pedido.pedido_id.slice(0, 8).toUpperCase() }}
                </div>
                <div class=" text-grey-7 q-mt-xs flex items-center">
                  <q-icon name="calendar_today" size="xs" class="q-mr-xs" />
                  {{ formatarData(pedido.criado_em) }}
                </div>
              </div>
              <div class="col-auto">
                <q-chip :color="obterCorStatus(pedido.status)" text-color="white"
                  :label="obterLabelStatus(pedido.status)" size="md" class="shadow-2" />
              </div>
              <div class="col-auto text-right">
                <div class="text-weight-bold" style="color: #d32f2f; font-size: 18px;">
                  R$ {{ formatarValor(pedido.valor_total) }}
                </div>
              </div>
            </div>
          </div>
        </template>
        <!-- Conteúdo expandido -->
        <div class="q-px-lg q-pt-lg q-pb-sm" style="background: linear-gradient(to right, #f5f7fa, #ffffff);">
          <div class="row q-col-gutter-lg q-mb-sm flex justify-center">
            <div class="col-12 col-sm-6 col-md-3 flex justify-center">
              <div class="info-box text-center">
                <q-icon name="info" color="grey-7" size="md" class="q-mb-sm" />
                <div class="text-grey-7">Status do Pedido</div>
                <div class="text-subtitle1 text-weight-bold " :style="{ color: obterCorStatus(pedido.status) }">
                  {{ obterLabelStatus(pedido.status) }}
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6 col-md-3 flex justify-center">
              <div class="info-box text-center">
                <q-icon name="schedule" color="grey-7" size="md" class="q-mb-sm" />
                <div class="text-grey-7">Data do Pedido</div>
                <div class="text-subtitle1 text-weight-bold ">
                  {{ formatarData(pedido.criado_em).split(' ')[0] }}
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6 col-md-3 flex justify-center">
              <div class="info-box text-center">
                <q-icon name="local_shipping" color="grey-7" size="md" class="q-mb-sm" />
                <div class="text-grey-7">Valor do Frete</div>
                <div class="text-subtitle1 text-weight-bold">
                  R$ {{ formatarValor(pedido.frete_valor) }}
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6 col-md-3 flex justify-center">
              <div class="info-box text-center">
                <q-icon :name="pedido.tem_rastreio ? 'check_circle' : 'cancel'"
                  :color="pedido.tem_rastreio ? 'positive' : 'grey'" size="md" class="q-mb-sm" />
                <div class="text-grey-7">Rastreamento</div>
                <div class="text-subtitle1 text-weight-bold"
                  :style="{ color: pedido.tem_rastreio ? '#4caf50' : '#9e9e9e' }">
                  {{ pedido.tem_rastreio ? 'Disponível' : 'Indisponível' }}
                </div>
              </div>
            </div>
          </div>
          <q-separator class="q-mb-md q-mt-xs" />
          <!-- Resumo do pedido -->
          <div class="resumo-pedido q-pa-sm"
            style="background: white; border-radius: 12px; border-left: 5px solid var(--q-primary); box-shadow: 0 4px 12px rgba(26, 35, 126, 0.1);">
            <div class="text-weight-bold q-mb-sm text-primary" style="font-size: 18px;">Resumo do Pedido</div>
            <div class=" row items-center justify-between q-mb-xs">
              <div class="text-body2">Valor dos Produtos:</div>
              <div class="text-body1 text-weight-bold">
                R$ {{ formatarValor(pedido.valor_total - pedido.frete_valor) }}
              </div>
            </div>
            <div class="row items-center justify-between q-mb-sm">
              <div class="text-body2">Valor do Frete:</div>
              <div class="text-body1 text-weight-bold">
                R$ {{ formatarValor(pedido.frete_valor) }}
              </div>
            </div>
            <q-separator class="q-my-sm" />
            <div class="row items-center justify-between" style="font-size: 18px;">
              <div class="text-weight-bold">Total do Pedido:</div>
              <div class="text-weight-bold">
                R$ {{ formatarValor(pedido.valor_total) }}
              </div>
            </div>
          </div>
          <q-separator class="q-my-md" />
          <div class="row q-gutter-md justify-end">
            <q-btn outline color="primary" label="Ver Detalhes" icon="info"
              style="border-radius: 20px; text-transform: none; font-weight: 600;" class="action-btn" />
            <q-btn v-if="pedido.status === 'PENDENTE'" color="primary" label="Pagar Agora" icon="payment"
              style="border-radius: 20px; text-transform: none; font-weight: 600; background: linear-gradient(135deg, #1a237e, #283593);"
              class="action-btn shadow-3" />
            <q-btn v-else-if="pedido.status === 'ENVIADO' && pedido.tem_rastreio" color="info" label="Rastrear"
              icon="tracking" style="border-radius: 20px; text-transform: none; font-weight: 600;" class="action-btn" />
          </div>
        </div>
      </q-expansion-item>
    </div>
  </q-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
// import { useRouter } from 'vue-router'
import { useAuth } from 'src/composables/useAuth'
import { ListarPedidos } from 'src/services/pedidoServices'
interface Pedido {
  criado_em: string
  frete_valor: number
  pedido_id: string
  status: string
  tem_rastreio: boolean
  valor_total: number
}

const $q = useQuasar()
//const router = useRouter()
const { getUser } = useAuth()

const user = getUser()
const pedidos = ref<Pedido[]>([])
const carregando = ref(false)

const carregarPedidos = async () => {
  if (!user?.id) {
    $q.notify({
      type: 'negative',
      message: 'Usuário não identificado!',
      position: 'bottom',
      timeout: 2500
    })
    return
  }

  carregando.value = true
  try {
    const resultado = await ListarPedidos(user.id, user.token)
    console.log('Pedidos carregados:', resultado)

    pedidos.value = Array.isArray(resultado) ? resultado : resultado?.data || []

  } catch (err) {
    console.error('Erro ao carregar pedidos:', err)
  } finally {
    carregando.value = false
  }
}

const formatarData = (data: string | undefined) => {
  if (!data) return '-'
  try {
    const d = new Date(data)
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return '-'
  }
}

const formatarValor = (valor: number | string | undefined) => {
  if (valor === null || valor === undefined) return '0,00'
  const num = typeof valor === 'string' ? parseFloat(valor) : Number(valor)
  if (isNaN(num)) return '0,00'
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const obterCorStatus = (status: string | undefined) => {
  if (!status) return 'grey'
  const normalizado = status.toUpperCase()
  const cores: { [key: string]: string } = {
    PENDENTE: 'amber-9',
    PROCESSANDO: 'blue-7',
    ENVIADO: 'teal',
    ENTREGUE: 'green',
    CANCELADO: 'red'
  }
  return cores[normalizado] || 'grey'
}

const obterLabelStatus = (status: string | undefined) => {
  if (!status) return 'Desconhecido'
  const normalizado = status.toUpperCase()
  const labels: { [key: string]: string } = {
    PENDENTE: 'Pendente de Pagamento',
    PROCESSANDO: 'Processando',
    ENVIADO: 'Enviado',
    ENTREGUE: 'Entregue',
    CANCELADO: 'Cancelado'
  }
  return labels[normalizado] || status
}

// const verDetalhes = async (pedidoId: string) => {
//   await router.push(`/pedido/${pedidoId}`)
// }

// const abrirPagamento = async (pedidoId: string) => {
//   await router.push(`/pagamento/${pedidoId}`)
// }

// const abrirRastreamento = (pedidoId: string) => {
//   $q.notify({
//     type: 'info',
//     message: `Abrindo rastreamento do pedido ${pedidoId.slice(0, 8).toUpperCase()}`,
//     position: 'bottom',
//     timeout: 2000
//   })
//   // Aqui você pode chamar uma rota de rastreamento
//   // await router.push(`/rastreamento/${pedidoId}`)
// }

onMounted(async () => {
  await carregarPedidos()
})
</script>

<style scoped>
.hover-scale {
  transition: transform 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.02);
}
</style>
