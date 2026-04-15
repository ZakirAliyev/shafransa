import api from "./api";

export const getMe = async () => {
    return api.get("/user/me");
};

export const updateMe = async (data) => {
    return api.put("/user/me", data);
};

export const getAllUsers = async () => {
    return api.get("/user");
};
