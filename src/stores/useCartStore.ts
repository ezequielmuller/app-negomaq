import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useCartStore = defineStore('cart', {
  state: () => ({
    carrinho: ref([]),
  }),
  actions: {
    setCartStore(cart: []) {
      this.carrinho = cart
    },
    deletCartStore() {
      this.carrinho = []
    }
  },
})
