import api from "./api"

export const getBlogs = async (params = {}) => {
  return await api.get("/blogs", { params })
}

export const getBlog = async (id) => {
  return await api.get(`/blogs/${id}`)
}

export const createBlog = async (data) => {
  const isFormData = data instanceof FormData;
  return await api.post("/blogs", data, {
    headers: {
      "Content-Type": isFormData ? "multipart/form-data" : "application/json",
    },
  })
}

export const updateBlog = async (id, data) => {
  const isFormData = data instanceof FormData;
  return await api.put(`/blogs/${id}`, data, {
    headers: {
      "Content-Type": isFormData ? "multipart/form-data" : "application/json",
    },
  })
}

export const deleteBlog = async (id) => {
  return await api.delete(`/blogs/${id}`)
}
