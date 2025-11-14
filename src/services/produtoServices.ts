import api from './api';
import type { ProdutoPayload } from '../types/types';
import { tratarErro } from 'src/utils/tratarErro';

const VITE_ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN;

export const criarProduto = async (produto: ProdutoPayload) => {
  try {
    const response = await api.post('/admin/produtos', produto, {
      headers: { Authorization: VITE_ADMIN_TOKEN },
    });
    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao criar produto.");
  }
};

export const listarProdutos = async () => {
  try {
    const response = await api.get('/produtos', {
      headers: { Authorization: VITE_ADMIN_TOKEN },
    });
    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao listar produtos.");
  }
};

export const deletarProduto = async (id: string) => {
  try {
    const response = await api.delete(`/admin/produtos/${id}`, {
      headers: { Authorization: VITE_ADMIN_TOKEN },
    });
    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao deletar produto.");
  }
};

export const atualizarEstoque = async (id: string, estoque: number) => {
  try {
    const response = await api.put(`/admin/estoque/${id}`, { estoque }, {
      headers: { Authorization: VITE_ADMIN_TOKEN },
    });
    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao atualizar estoque.");
  }
};

export const atualizarProduto = async (id: string, dados: ProdutoPayload) => {
  try {
    const response = await api.put(`/admin/produtos/${id}`, dados, {
      headers: { Authorization: VITE_ADMIN_TOKEN },
    });
    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao atualizar produto.");
  }
};

export const ListarProdutosHome = async () => {
  try {
    const response = await api.get('/produtos/home', {
      headers: { Authorization: VITE_ADMIN_TOKEN },
    });
    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao listar produtos da home.");
  }
};

export const CotacaoFrete = async (data: object) => {
  try {
    const response = await api.post(`/frete/cotacao`, data, {
      headers: { Authorization: VITE_ADMIN_TOKEN },
    });
    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao calcular frete.");
  }
};
