export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  img?: string;
}

export type ProdutoPayload = Omit<Produto, 'id'>;
export type Usuario = {
  id: string;
  nome: string;
  email: string;
  is_admin: boolean;
};

export type LoginResponse = {
  mensagem: string;
  is_admin: boolean;
};

export type ErrorResponse = {
  erro: string;
};
