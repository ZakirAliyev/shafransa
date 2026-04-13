import api from "./api";

export const consultAI = async (symptoms) => {
  return await api.post("/ai/consult", { symptoms });
};
