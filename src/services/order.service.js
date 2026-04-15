import api from "./api";

export const checkout = async (data) => {
  return await api.post("/orders/checkout", data);
};

export const getMyOrders = async () => {
  return await api.get("/orders/my");  // ✅ Backend route is /orders/my
};

export const getSellerOrders = async () => {
  return await api.get("/orders/seller");
};
