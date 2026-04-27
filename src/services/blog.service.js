import api from "./api"

export const getBlogs = async (params = {}) => {
  return await api.get("/blogs", { params })
}

export const getBlog = async (id) => {
  return await api.get(`/blogs/${id}`)
}

export const createBlog = async (data) => {
  return await api.post("/blogs", data)
}

export const updateBlog = async (id, data) => {
  return await api.put(`/blogs/${id}`, data)
}

export const deleteBlog = async (id) => {
  return await api.delete(`/blogs/${id}`)
}
