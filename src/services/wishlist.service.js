import api from "./api"

// ✅ Interceptor already unwraps response.data

export const getWishlist = async () => {
  return await api.get("/wishlist")
}

export const toggleWishlist = async (productId) => {
  return await api.post(`/wishlist/${productId}`)
}
