import { tratarErro } from 'src/utils/tratarErro';
import api from './api';

const VITE_ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN;

export const CriarEndereco = async (data: object, usuarioId: string) => {
  try {
    const response = await api.post(`/usuarios/${usuarioId}/enderecos`, data, {
      headers: { Authorization: VITE_ADMIN_TOKEN }
    });
    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao criar endereço.");
  }
};

export const EditarEndereco = async (enderecoId: string, data: object) => {
  try {
    const response = await api.put(`/enderecos/${enderecoId}`, data, {
      headers: { Authorization: VITE_ADMIN_TOKEN }
    });
    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao editar endereço.");
  }
};

export const DeletarEndereco = async (enderecoId: string) => {
  try {
    const response = await api.delete(`/enderecos/${enderecoId}`, {
      headers: { Authorization: VITE_ADMIN_TOKEN }
    });
    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao deletar endereço.");
  }
};

export const ListarEnderecos = async (usuarioId: string) => {
  try {
    const response = await api.get(`/usuarios/${usuarioId}/enderecos`, {
      headers: { Authorization: VITE_ADMIN_TOKEN }
    });
    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao listar endereços.");
  }
};

export const ObterEndereco = async (enderecoId: string) => {
  try {
    const response = await api.get(`/enderecos/${enderecoId}`, {
      headers: { Authorization: VITE_ADMIN_TOKEN }
    });
    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao obter endereço.");
  }
};
