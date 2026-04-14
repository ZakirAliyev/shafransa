import api from "./api";

export const getMe = async () => {
    return api.get("/User/me");
};

export const updateMe = async (data) => {
    if (data instanceof FormData) {
        return api.put("/User/me", data, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    }
    return api.put("/User/me", data);
};

export const getAllUsers = async () => {
    return api.get("/User");
};
