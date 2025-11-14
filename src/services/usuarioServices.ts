import api from "./api";
import type { UsuarioEdicao } from '../types/types';
import { tratarErro } from "src/utils/tratarErro";

export const LogarUsuario = async (data: { email: string; senha: string }) => {
  try {
    const response = await api.post('/auth/login', data);
    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao fazer login.");
  }
};

export const CadastrarUsuario = async (data: object) => {
  try {
    const response = await api.post('/auth/registrar', data);
    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao cadastrar usuário.");
  }
};

export const EditarPerfil = async (dados: UsuarioEdicao, token: string) => {
  try {
    const response = await api.put('/auth/editar', dados, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao editar perfil.");
  }
};

export const SolicitarRecuperacaoSenha = async (email: string) => {
  try {
    const response = await api.post('/auth/recuperar/solicitar', { email });
    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao solicitar recuperação de senha.");
  }
};

export const VerificarCodigoRecuperacao = async (
  email: string,
  codigo: string,
  nova_senha: string
) => {
  try {
    const response = await api.post('/auth/recuperar/verificar', {
      email,
      codigo,
      nova_senha
    });

    return response.data;
  } catch (err) {
    return tratarErro(err, "Erro ao verificar código de recuperação.");
  }
};
