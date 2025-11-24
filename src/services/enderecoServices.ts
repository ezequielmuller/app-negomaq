import { tratarErro } from 'src/utils/tratarErro';
import api from './api';

//const VITE_ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN;

export const CriarEndereco = async (data: object, id: string, token: string) => {
  try {
    const response = await api.post(`/usuarios/${id}/enderecos`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao criar endereço.");
  }
};

export const EditarEndereco = async (enderecoId: string, data: object, token: string) => {
  try {
    const response = await api.put(`/enderecos/${enderecoId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao editar endereço.");
  }
};

export const DeletarEndereco = async (enderecoId: string, token: string) => {
  try {
    const response = await api.delete(`/enderecos/${enderecoId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao deletar endereço.");
  }
};

export const ListarEnderecos = async (id: string, token: string) => {
  try {
    const response = await api.get(`/usuarios/${id}/enderecos`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao listar endereços.");
  }
};

export const ObterEndereco = async (enderecoId: string, token: string) => {
  try {
    const response = await api.get(`/enderecos/${enderecoId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao obter endereço.");
  }
};
