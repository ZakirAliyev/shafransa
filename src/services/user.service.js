import api from "./api";

export const getMe = async () => {
    return api.get("/User/me");
};

export const updateMe = async (data) => {
    return api.put("/User/me", data);
};

export const getAllUsers = async () => {
    return api.get("/User");
};
