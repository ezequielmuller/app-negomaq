export type Produto = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: 'facas' | 'estojos' | 'aventais' | 'churrascos';
  img?: string;
  estoque: number;
};

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
