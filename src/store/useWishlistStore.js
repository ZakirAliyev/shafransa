import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [], // array of product IDs

      isInWishlist: (productId) => get().items.includes(productId),

      toggle: (productId) => {
        const items = get().items
        if (items.includes(productId)) {
          set({ items: items.filter((id) => id !== productId) })
          return "removed"
        } else {
          set({ items: [...items, productId] })
          return "added"
        }
      },

      setItems: (newIds) => set({ items: newIds }),

      count: () => get().items.length,
    }),
    { name: "shafransa-wishlist" }
  )
)
