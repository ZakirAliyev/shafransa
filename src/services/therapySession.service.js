import api from "./api";

// User Endpoints
export const createSession = async (data) => {
    return api.post("/therapy-sessions", data);
};

export const getAvailableSlots = async (therapistId, from, to) => {
    return api.get(`/therapy-sessions/therapist/${therapistId}/available-slots`, {
        params: { from, to }
    });
};

export const getAvailabilitySummary = async (therapistId, year, month) => {
    return api.get(`/therapy-sessions/therapist/${therapistId}/availability-summary`, {
        params: { year, month }
    });
};

export const getMySessions = async () => {
    return api.get("/therapy-sessions/my-sessions");
};

export const confirmSessionAsUser = async (sessionId) => {
    return api.post(`/therapy-sessions/${sessionId}/confirm-user`);
};

export const cancelSession = async (sessionId) => {
    return api.post(`/therapy-sessions/${sessionId}/cancel`);
};

export const rateSession = async (sessionId, rating, review) => {
    return api.post(`/therapy-sessions/${sessionId}/rate`, { rating, review });
};

// Therapist Endpoints
export const getMyTherapistSessions = async () => {
    return api.get("/therapy-sessions/my-therapist-sessions");
};

export const confirmSessionAsTherapist = async (sessionId, data) => {
    return api.post(`/therapy-sessions/${sessionId}/confirm-therapist`, data);
};

export const rejectSessionAsTherapist = async (sessionId) => {
    return api.post(`/therapy-sessions/${sessionId}/reject-therapist`);
};

export const completeSession = async (sessionId) => {
    return api.post(`/therapy-sessions/${sessionId}/complete`);
};

// Time Slot Management
export const setWorkingHours = async (data) => {
    return api.post("/therapy-sessions/working-hours", data);
};

export const getMyReservedSlots = async () => {
    return api.get("/therapy-sessions/my-reserved-slots");
};
