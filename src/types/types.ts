// Produtos ---
export interface Produto {
  id: string
  nome: string
  descricao: string
  preco: number
  categoria: string
  estoque: number
  peso: number
  largura: number
  altura: number
  comprimento: number
  img?: string
  qtd?: number
}
export type ProdutoPayload = Omit<Produto, 'id'>

// Usuários ---
export type Usuario = {
  id: string
  nome: string
  sobrenome: string
  email: string
  cpf: string
  is_admin: boolean
  telefone: string
  senha?: string
  enderecos?: Endereco
  token: string
};

export type UsuarioEdicao = {
  email: string
  novo_nome?: string
  novo_sobrenome?: string
  novo_email?: string
  novo_telefone?: string
  novo_cpf?: string
}

// Endereços ---
export type Endereco = {
  id?: string
  bairro: string
  cep: string
  cidade: string
  complemento: string
  estado: string
  logradouro: string
  numero: string
}


