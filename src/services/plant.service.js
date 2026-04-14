import api from "./api"

// api.js interceptor already unwraps response.data
// Backend returns plain array for GET /plants

export const getPlants = async (params = {}) => {
  return await api.get("/plants", { params })
}

export const getPlant = async (id) => {
  return await api.get(`/plants/${id}`)
}

export const createPlant = async (data) => {
  const isFormData = data instanceof FormData;
  return await api.post("/plants", data, {
    headers: {
      "Content-Type": isFormData ? "multipart/form-data" : "application/json",
    },
  })
}

export const updatePlant = async (id, data) => {
  const isFormData = data instanceof FormData;
  return await api.put(`/plants/${id}`, data, {
    headers: {
      "Content-Type": isFormData ? "multipart/form-data" : "application/json",
    },
  })
}

export const deletePlant = async (id) => {
  return await api.delete(`/plants/${id}`)
}
