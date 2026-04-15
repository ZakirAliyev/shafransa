import api from "./api"

// ✅ Interceptor already unwraps response.data, so don't use res.data
export const getCategories = async () => {
  return await api.get("/categories")
}

export const createCategory = async (data) => {
  if (data instanceof FormData) {
    return await api.post("/categories", data, {
      headers: { "Content-Type": "multipart/form-data" }
    })
  }
  return await api.post("/categories", data)
}

export const deleteCategory = async (id) => {
  return await api.delete(`/categories/${id}`)
}
