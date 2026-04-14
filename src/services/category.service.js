import api from "./api"

// api.js interceptor already unwraps response.data
// Backend returns { success, data: [...] } so we access .data once
export const getCategories = async () => {
  const res = await api.get("/categories")
  return res.data  // res is already response.data from interceptor, so res.data = the categories array
}

export const createCategory = async (data) => {
  if (data instanceof FormData) {
    const res = await api.post("/categories", data, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    return res.data
  }
  const res = await api.post("/categories", data)
  return res.data
}

export const deleteCategory = async (id) => {
  return await api.delete(`/categories/${id}`)
}
