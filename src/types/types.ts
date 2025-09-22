export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  estoque: number;
  img?: string;
}

export type ProdutoPayload = Omit<Produto, 'id'>;

export type Usuario = {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  is_admin: boolean;
  telefone: string;
  senha: string;
};
