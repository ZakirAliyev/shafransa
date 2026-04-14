import api from "./api";

export const getVerifiedTherapists = async () => {
    return api.get("/Therapists/verified");
};

export const getTherapistById = async (id) => {
    return api.get(`/Therapists/${id}`);
};

export const registerAsTherapist = async (data) => {
    return api.post("/Therapists/register", data);
};

export const getMyTherapistProfile = async () => {
    return api.get("/Therapists/me");
};

export const updateMyProfile = async (data) => {
    // This is probably FromForm in backend as it handles files
    return api.put("/Therapists/me", data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

// Admin Endpoints
export const getAllTherapists = async () => {
    return api.get("/Therapists");
};

export const getAllRequests = async () => {
    return api.get("/Therapists/requests");
};

export const getPendingRequests = async () => {
    return api.get("/Therapists/requests/pending");
};

export const approveRequest = async (requestId) => {
    return api.post(`/Therapists/requests/${requestId}/approve`);
};

export const rejectRequest = async (requestId, reason) => {
    return api.post(`/Therapists/requests/${requestId}/reject`, { reason });
};

export const updateMenuStatus = async (therapistId, isShowMenu) => {
    return api.put(`/Therapists/${therapistId}/menu-status`, { isShowMenu });
};
