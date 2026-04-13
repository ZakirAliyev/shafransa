import api from "./api"

// api.js interceptor already unwraps response.data

export const createReview = async (productId, data) => {
  const res = await api.post(`/reviews/${productId}`, data)
  return res.data
}

export const getProductReviews = async (productId) => {
  const res = await api.get(`/reviews/${productId}`)
  return res.data
}
