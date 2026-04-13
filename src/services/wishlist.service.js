import api from "./api"

// api.js interceptor already unwraps response.data

export const getWishlist = async () => {
  const res = await api.get("/wishlist")
  return res.data
}

export const toggleWishlist = async (productId) => {
  return await api.post(`/wishlist/${productId}`)
}
