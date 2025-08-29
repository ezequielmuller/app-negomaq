import api from './api';
import type { ProdutoPayload, UsuarioEditar } from '../types/types';

const VITE_ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN;

export const criarProduto = async (produto: ProdutoPayload) => {
  try {
    await api.post('/admin/produtos', produto, {
      headers: {
        Authorization: VITE_ADMIN_TOKEN,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const listarProdutos = async () => {
  const { data } = await api.get('/produtos');
  return data;
};

export const deletarProduto = async (id: string) => {
  try {
    await api.delete(`/admin/produtos/${id}`, {
      headers: {
        Authorization: VITE_ADMIN_TOKEN,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export const atualizarEstoque = async (id: string, estoque: number) => {
  try {
    await api.put(
      `/admin/estoque/${id}`,
      { estoque },
      {
        headers: {
          Authorization: VITE_ADMIN_TOKEN,
        },
      },
    );
  } catch (err) {
    console.log(err);
  }
};

export const atualizarProduto = async (id: string, dados: ProdutoPayload) => {
  try {
    await api.put(`/admin/produtos/${id}`, dados, {
      headers: {
        Authorization: VITE_ADMIN_TOKEN,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export const EditarUsuario = async (dados: UsuarioEditar) => {
  try {
    await api.put(`/admin/editar`, dados, {
      headers: {
        Authorization: VITE_ADMIN_TOKEN,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
