import api from "./api"

// ✅ Interceptor already unwraps response.data

export const createReview = async (productId, data) => {
  return await api.post(`/reviews/${productId}`, data)
}

export const getProductReviews = async (productId) => {
  return await api.get(`/reviews/${productId}`)
}
