import api from './api';
import type { ProdutoPayload } from '../types/types';
import { tratarErro } from 'src/utils/tratarErro';

const VITE_ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN;

export const criarProduto = async (produto: ProdutoPayload, arquivos?: File[]) => {
  try {
    const formData = new FormData();
    formData.append('nome', String(produto.nome).trim());
    formData.append('descricao', String(produto.descricao).trim());
    formData.append('preco', String(Number(produto.preco)));
    formData.append('categoria', String(produto.categoria).trim());
    formData.append('estoque', String(Number(produto.estoque) || 0));
    formData.append('peso', String(Number(produto.peso)));
    formData.append('largura', String(Number(produto.largura)));
    formData.append('altura', String(Number(produto.altura)));
    formData.append('comprimento', String(Number(produto.comprimento)));
    if (arquivos && arquivos.length > 0 && arquivos[0]) {
      formData.append('arquivo', arquivos[0] as Blob);
    }
    console.log('FormData preparado:', formData);
    const response = await api.post('/admin/produtos', formData, {
      headers: {
        Authorization: `Bearer ${VITE_ADMIN_TOKEN}`,
      }
    });
    console.log('Resposta do servidor:', response.data);
    return response.data;
  } catch (err) {
    console.error('Erro ao criar produto:', err);
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
