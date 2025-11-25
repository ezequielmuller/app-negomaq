import { tratarErro } from 'src/utils/tratarErro';
import api from './api';

export interface ItemPedido {
  produto_id: string;
  quantidade: number;
}

export interface FretePagamento {
  valor: number;
  tipo: string;
  servico_id: number;
  servico: string;
}

export interface CriarPedidoPayload {
  usuario_id: string;
  endereco_id: string;
  itens: ItemPedido[];
  frete: FretePagamento;
}

export interface CalcularFretePayload {
  usuario_id: string;
  itens: ItemPedido[];
}

export interface FreteResponse {
  id: number;
  prazo_dias: number;
  prazo_max: number;
  prazo_min: number;
  preco: number;
  servico: string;
  transportadora: string;
}

export interface CriarPagamentoPayload {
  pedido_id: string;
  metodo: string; // "mercado_pago"
}

export interface PagamentoResponse {
  checkout_url: string;
  pedido_id: string;
  preference_id: string;
  sandbox_checkout_url: string;
  transacao_id: string;
}

export interface CriarPedidoResponse {
  pedido_id: string;
  valor_produtos: number;
  valor_frete: number;
  valor_total: number;
  frete_tipo: string;
  frete_servico: string;
}

export const CriarPedido = async (data: CriarPedidoPayload, token: string): Promise<CriarPedidoResponse | null> => {
  try {
    const response = await api.post('/pedidos', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao criar pedido.");
  }
};

export const ListarPedidos = async (usuarioId: string, token: string) => {
  try {
    const response = await api.get(`/pedidos/usuario/${usuarioId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao listar pedidos.");
  }
};

export const ObterPedido = async (pedidoId: string, token: string) => {
  try {
    const response = await api.get(`/pedidos/${pedidoId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao obter pedido.");
  }
};

export const CalcularFrete = async (data: CalcularFretePayload, token: string) => {
  try {
    const response = await api.post(
      '/frete/cotacao', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao calcular frete.");
  }
};

export const CriarPagamento = async (data: CriarPagamentoPayload, token: string): Promise<PagamentoResponse | null> => {
  try {
    const response = await api.post(`/pedidos/${data.pedido_id}/pagamento/preferencia`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao criar pagamento.");
  }
};

export const VerificarStatusPagamento = async (pagamentoId: string, token: string) => {
  try {
    const response = await api.get(`/pagamentos/${pagamentoId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao verificar status do pagamento.");
  }
};
