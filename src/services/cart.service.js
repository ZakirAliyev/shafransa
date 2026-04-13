import api from "./api";

export const getCart = async () => {
  return await api.get("/cart");
};

export const addToCart = async (productId, quantity) => {
  return await api.post("/cart/add", { productId, quantity });
};

export const updateCartItem = async (id, quantity) => {
  return await api.put(`/cart/${id}`, { quantity });
};

export const removeFromCart = async (id) => {
  return await api.delete(`/cart/${id}`);
};
