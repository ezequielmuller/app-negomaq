import api from './api';
import type { ProdutoPayload } from '../types/types';

const VITE_ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN;

export const criarProduto = (produto: ProdutoPayload) =>
  api.post('/admin/produtos', produto, {
    headers: {
      Authorization: VITE_ADMIN_TOKEN,
    },
  });

export const deletarProduto = (id: string) =>
  api.delete(`/admin/produtos/${id}`, {
    headers: {
      Authorization: VITE_ADMIN_TOKEN,
    },
  });

export const atualizarEstoque = (id: string, estoque: number) =>
  api.put(
    `/admin/estoque/${id}`,
    { estoque },
    {
      headers: {
        Authorization: VITE_ADMIN_TOKEN,
      },
    },
  );

export const atualizarProduto = (id: string, dados: ProdutoPayload) =>
  api.put(`/admin/produtos/${id}`, dados, {
    headers: {
      Authorization: VITE_ADMIN_TOKEN,
    },
  });
