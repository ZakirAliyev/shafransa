import api from "./api"

// api.js interceptor already unwraps response.data — do NOT double-unwrap

export const getProducts = async (params = {}) => {
  // Returns { success, data: [...], pagination: {...} }
  return await api.get("/products", { params })
}

export const getProductById = async (id) => {
  // Returns { success, data: { ...product, avgRating, related } }
  const res = await api.get(`/products/${id}`)
  return res.data
}

export const getMyProducts = async () => {
  // Returns { success, data: [...] }
  const res = await api.get("/products/my/products")
  return res.data
}

export const getSellerProducts = async (sellerId) => {
  const res = await api.get(`/products/seller/${sellerId}`)
  return res.data
}

export const createProduct = async (data) => {
  const res = await api.post("/products", data)
  return res.data
}

export const updateProduct = async (id, data) => {
  const res = await api.put(`/products/${id}`, data)
  return res.data
}

export const deleteProduct = async (id) => {
  return await api.delete(`/products/${id}`)
}
