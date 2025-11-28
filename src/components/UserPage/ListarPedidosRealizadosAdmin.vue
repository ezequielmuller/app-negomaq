<template>
  <q-card class="q-pa-md shadow-1" style="border-radius: 16px;">
    <div class="row items-center q-mb-md">
      <q-icon name="sell" size="md" color="primary" class="q-mr-sm" />
      <div class="text-h6">Pedidos</div>
      <q-space />
      <q-input v-model="filtroStatus" outlined dense placeholder="Filtrar por status..." class="q-mr-md"
        style="width: 200px; border-radius: 8px;" />
      <q-btn flat dense icon="refresh" @click="carregarPedidos" color="primary" />
    </div>
    <q-separator class="q-mb-md" />
    <div v-if="pedidosFiltrados.length === 0" class="text-center q-pa-lg text-grey-6">
      <q-icon name="pending_actions" size="64px" />
      <div class="text-h6 q-mt-md">Nenhum pedido encontrado</div>
    </div>
    <div v-else>
      <q-table flat bordered :rows="pedidosFiltrados" :columns="colunas" row-key="id" v-model:pagination="paginacao"
        class="rounded-borders" style="border-radius: 12px; border: 0.5mm solid var(--q-primary);">
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip :color="obterCorStatus(props.row.status)" text-color="white"
              :label="obterLabelStatus(props.row.status)" size="md" />
          </q-td>
        </template>
        <template v-slot:body-cell-valor_total="props">
          <q-td :props="props" class="text-weight-bold text-primary">
            R$ {{ formatarValor(props.row.valor_total) }}
          </q-td>
        </template>
        <template v-slot:body-cell-criado_em="props">
          <q-td :props="props">
            {{ formatarData(props.row.criado_em) }}
          </q-td>
        </template>
        <template v-slot:body-cell-acoes="props">
          <q-td :props="props">
            <q-btn flat dense round icon="visibility" color="primary" size="md" @click="verDetalhes(props.row)"
              class="q-mr-xs">
              <q-tooltip>Ver detalhes</q-tooltip>
            </q-btn>
            <!-- <q-btn flat dense round icon="edit" color="amber-9" size="md" @click="editarStatus(props.row)">
              <q-tooltip>Editar status</q-tooltip>
            </q-btn> -->
          </q-td>
        </template>
      </q-table>
    </div>
  </q-card>
  <!-- Dialog Detalhes do Pedido -->
  <q-dialog v-model="dialogDetalhes" persistent>
    <q-card style="width: 500px; max-height: 70vh; border-radius: 20px;" class="column no-wrap">
      <q-card-section class="bg-primary text-white">
        <div class="row items-center" style="gap: 8px">
          <q-icon name="info" size="md" />
          <div class="text-h6">Detalhes do Pedido</div>
        </div>
      </q-card-section>
      <q-card-section class="scroll" style="flex: 1; overflow-y: auto;">
        <div v-if="pedidoSelecionado" class="column q-gutter-md">
          <div>
            <div class="text-grey-7">ID do Pedido: </div>
            <div>{{ pedidoSelecionado.id }}</div>
          </div>
          <q-separator />
          <div>
            <div class="text-grey-7">ID do Usuário</div>
            <div class="">{{ pedidoSelecionado.usuario_id }}</div>
          </div>
          <q-separator />
          <div>
            <div class="text-grey-7">Status</div>
            <q-chip :color="obterCorStatus(pedidoSelecionado.status)" text-color="white"
              :label="obterLabelStatus(pedidoSelecionado.status)" size="md" />
          </div>
          <q-separator />
          <div>
            <div class="text-grey-7">Data de Criação</div>
            <div>
              {{ formatarData(pedidoSelecionado.criado_em) }}
            </div>
          </div>
          <q-separator />
          <div>
            <div class="text-grey-7">Valor Total</div>
            <div class="text-h6 text-primary text-bold">
              R$ {{ formatarValor(pedidoSelecionado.valor_total) }}
            </div>
          </div>
        </div>
      </q-card-section>
      <q-separator spaced />
      <q-card-actions align="right" class="q-mr-sm q-mb-xs">
        <q-btn outline label="Fechar" color="primary" @click="dialogDetalhes = false" style="border-radius: 20px;"
          icon="close" class="hover-scale" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- Dialog Editar Status -->
  <q-dialog v-model="dialogEditarStatus" persistent>
    <q-card style="width: 400px; border-radius: 20px;">
      <q-card-section class="bg-amber-9 text-white">
        <div class="row items-center" style="gap: 8px">
          <q-icon name="edit" size="md" />
          <div class="text-h6">Alterar Status do Pedido</div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-md">
        <div v-if="pedidoSelecionado" class="column q-gutter-md">
          <div>
            <div class="text-subtitle2 text-weight-bold q-mb-sm">Status Atual</div>
            <q-chip :color="obterCorStatus(pedidoSelecionado.status)" text-color="white"
              :label="obterLabelStatus(pedidoSelecionado.status)" size="md" />
          </div>
          <q-separator />
          <div>
            <div class="text-subtitle2 text-weight-bold q-mb-sm">Novo Status</div>
            <q-select v-model="novoStatus" :options="statusOptions" outlined dense label="Selecione o novo status"
              emit-value map-options />
          </div>
        </div>
      </q-card-section>
      <q-separator spaced />
      <q-card-actions align="right" class="q-mr-sm q-mb-xs">
        <q-btn flat label="Cancelar" color="grey-7" @click="dialogEditarStatus = false" style="border-radius: 20px;"
          class="hover-scale" />
        <q-btn label="Salvar" color="amber-9" @click="atualizarStatus" style="border-radius: 20px;" icon="save"
          class="hover-scale" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import type { PedidoAdmin } from 'src/services/pedidoServices'
import { AtualizarStatusPedido, ListarPedidosAdmin } from 'src/services/pedidoServices'
//Utils ---
const $q = useQuasar()
// Refs ---
const pedidos = ref<PedidoAdmin[]>([])
const filtroStatus = ref('')
const dialogDetalhes = ref(false)
const dialogEditarStatus = ref(false)
const pedidoSelecionado = ref({
  criado_em: '',
  id: '',
  status: '',
  usuario_id: '',
  valor_total: 0
})
const novoStatus = ref('')
const paginacao = ref({
  sortBy: 'criado_em',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})
const colunas = [
  {
    name: 'id',
    label: 'ID do Pedido',
    field: 'id',
    align: 'center' as const,
  },
  {
    name: 'nome',
    label: 'Cliente',
    field: 'nome',
    align: 'center' as const,
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center' as const
  },
  {
    name: 'criado_em',
    label: 'Data',
    field: 'criado_em',
    align: 'center' as const
  },
  {
    name: 'valor_total',
    label: 'Valor Total',
    field: 'valor_total',
    align: 'center' as const
  },
  {
    name: 'acoes',
    label: 'Ações',
    field: 'acoes',
    align: 'center' as const
  }
]

const statusOptions = [
  { label: 'Pendente de Pagamento', value: 'PENDENTE' },
  { label: 'Pago', value: 'PAGO' },
  { label: 'Em Separação', value: 'EM_SEPARACAO' },
  { label: 'Processando', value: 'PROCESSANDO' },
  { label: 'Enviado', value: 'ENVIADO' },
  { label: 'Entregue', value: 'ENTREGUE' },
  { label: 'Cancelado', value: 'CANCELADO' }
]

// Computed ---
const pedidosFiltrados = computed(() => {
  if (!filtroStatus.value) return pedidos.value
  return pedidos.value.filter(pedido =>
    pedido.status.toLowerCase().includes(filtroStatus.value.toLowerCase())
  )
})

// Methods ----
const carregarPedidos = async () => {
  try {
    $q.loading.show({ message: 'Carregando pedidos...' })
    const resultado = await ListarPedidosAdmin()
    pedidos.value = resultado
    paginacao.value.rowsNumber = pedidos.value.length
    if (pedidos.value.length === 0) {
      $q.notify({
        type: 'info',
        message: 'Nenhum pedido encontrado',
        position: 'bottom',
        timeout: 2000
      })
    }
  } catch (err) {
    console.error('Erro ao carregar pedidos:', err)
  } finally {
    $q.loading.hide()
  }
}

const obterCorStatus = (status: string | undefined): string => {
  if (!status) return 'grey'
  const normalizado = status.toUpperCase()
  const cores: { [key: string]: string } = {
    PENDENTE: 'amber-8',
    PAGO: 'blue-7',
    EM_SEPARACAO: 'brown',
    PROCESSANDO: 'purple',
    ENVIADO: 'teal',
    ENTREGUE: 'green',
    CANCELADO: 'red'
  }
  return cores[normalizado] || 'grey'
}

const obterLabelStatus = (status: string | undefined): string => {
  if (!status) return 'Desconhecido'
  const normalizado = status.toUpperCase()
  const labels: { [key: string]: string } = {
    PENDENTE: 'Pendente de Pagamento',
    PAGO: 'Pago',
    EM_SEPARACAO: 'Em Separação',
    PROCESSANDO: 'Processando',
    ENVIADO: 'Enviado',
    ENTREGUE: 'Entregue',
    CANCELADO: 'Cancelado'
  }
  return labels[normalizado] || status
}

const verDetalhes = (pedido: PedidoAdmin): void => {
  pedidoSelecionado.value = pedido
  dialogDetalhes.value = true
}

// const editarStatus = (pedido: PedidoAdmin): void => {
//   pedidoSelecionado.value = pedido
//   novoStatus.value = pedido.status
//   dialogEditarStatus.value = true
// }

const atualizarStatus = async (): Promise<void> => {
  if (!pedidoSelecionado.value || !novoStatus.value) {
    $q.notify({
      type: 'warning',
      message: 'Selecione um novo status!',
      position: 'bottom',
      timeout: 2500
    })
    return
  }
  try {
    $q.loading.show({ message: 'Atualizando status...' })
    const data = {
      status: novoStatus.value
    }
    const resultado = await AtualizarStatusPedido(pedidoSelecionado.value.id, data)
    console.log('Status atualizado:', resultado)
    $q.notify({
      type: 'positive',
      message: 'Status atualizado com sucesso!',
      position: 'bottom',
      timeout: 2000
    })
    dialogEditarStatus.value = false
    await carregarPedidos()
  } catch (err) {
    console.error('Erro ao atualizar status:', err)
  } finally {
    $q.loading.hide()
  }
}

// metodos uteis ---
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

onMounted(async () => {
  await carregarPedidos()
})
</script>
<style scoped>
.rounded-borders {
  border-radius: 12px;
}
</style>
