import { defineStore } from 'pinia'
import type { Produto } from 'src/types/types'
interface ProdutoCarrinho extends Produto {
  qtd: number
}
export const useCartStore = defineStore('cart', {
  state: () => ({
    carrinho: [] as ProdutoCarrinho[],
  }),
  actions: {
    adicionarAoCarrinho(produto: Produto) {
      const item = this.carrinho.find(p => p.id === produto.id)
      if (item) {
        item.qtd++
      } else {
        this.carrinho.push({ ...produto, qtd: 1 })
      }
    },
    removerDoCarrinho(id: string) {
      const item = this.carrinho.find(p => p.id === id)
      if (item) {
        if (item.qtd > 1) item.qtd--
        else this.carrinho = this.carrinho.filter(p => p.id !== id)
      }
    },
    limparCarrinho() {
      this.carrinho = []
    },
  },
  persist: true,
})
