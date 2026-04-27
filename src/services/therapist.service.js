import api from "./api";
import { MOCK_THERAPISTS, MOCK_THERAPY_REQUESTS } from "./mockData";

export const getVerifiedTherapists = async () => {
    try {
        return await api.get("/therapists/verified");
    } catch (error) {
        console.warn("⚠️ Using mock data for verified therapists (API failed)");
        return MOCK_THERAPISTS;
    }
};

export const getTherapistById = async (id) => {
    try {
        return await api.get(`/therapists/${id}`);
    } catch (error) {
        console.warn(`⚠️ Using mock data for therapist ${id} (API failed)`);
        const mockTherapist = MOCK_THERAPISTS.find(t => t.id === id);
        if (mockTherapist) return mockTherapist;
        // If ID not found in mock data, return first mock therapist
        return MOCK_THERAPISTS[0];
    }
};

export const registerAsTherapist = async (data) => {
    return api.post("/therapists/register", data);
};

export const getMyTherapistProfile = async () => {
    return api.get("/therapists/me");
};

export const updateMyProfile = async (data) => {
    return api.put("/therapists/me", data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

// Admin Endpoints
export const getAllTherapists = async () => {
    try {
        return await api.get("/therapists");
    } catch (error) {
        console.warn("⚠️ Using mock data for all therapists (API failed)");
        return MOCK_THERAPISTS;
    }
};

export const getAllRequests = async () => {
    try {
        return await api.get("/therapists/requests");
    } catch (error) {
        console.warn("⚠️ Using mock data for therapist requests (API failed)");
        return MOCK_THERAPY_REQUESTS;
    }
};

export const getProcessedRequests = async () => {
    try {
        return await api.get("/therapists/requests/processed");
    } catch (error) {
        console.warn("⚠️ Using mock data for processed requests (API failed)");
        return MOCK_THERAPY_REQUESTS.filter(r => r.status !== "Pending");
    }
};

export const getPendingRequests = async () => {
    try {
        return await api.get("/therapists/requests/pending");
    } catch (error) {
        console.warn("⚠️ Using mock data for pending requests (API failed)");
        return MOCK_THERAPY_REQUESTS.filter(r => r.status === "Pending");
    }
};

export const approveRequest = async (requestId) => {
    return api.post(`/therapists/requests/${requestId}/approve`);
};

export const rejectRequest = async (requestId, reason) => {
    return api.post(`/therapists/requests/${requestId}/reject`, { reason });
};

export const updateMenuStatus = async (therapistId, isShowMenu) => {
    return api.put(`/therapists/${therapistId}/menu-status`, { isShowMenu });
};
