import api from "./api";
import { MOCK_SESSIONS, MOCK_AVAILABILITY_SUMMARY } from "./mockData";

const LOCAL_SESSIONS_KEY = "shafransa_mock_sessions";

const readLocalSessions = () => {
    try {
        return JSON.parse(localStorage.getItem(LOCAL_SESSIONS_KEY) || "[]");
    } catch (error) {
        console.warn("⚠️ Failed to read local sessions", error?.message);
        return [];
    }
};

const writeLocalSessions = (sessions) => {
    try {
        localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(sessions));
    } catch (error) {
        console.warn("⚠️ Failed to save local sessions", error?.message);
    }
};

const getStartTimeFromBooking = (data) => {
    if (data.startTime) return data.startTime;

    const [day, month, year] = (data.date || "").split(".");
    const [hour, minute] = (data.hour || "00:00").split(":");

    if (!day || !month || !year) return new Date().toISOString();

    return new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        0,
        0
    ).toISOString();
};

const normalizeStatus = (status) => {
    const statusMap = {
        0: "PENDING",
        1: "THERAPIST_CONFIRMED",
        2: "CONFIRMED",
        3: "COMPLETED",
        4: "CANCELLED",
    };

    if (statusMap[status] || statusMap[Number(status)]) {
        return statusMap[status] || statusMap[Number(status)];
    }

    return String(status || "PENDING").toUpperCase();
};

const normalizeSession = (session) => {
    const therapist = session.therapist || session.Therapist || session.therapistSnapshot || {};
    const user = therapist.user || therapist.User || {};
    const startTime = session.startTime || session.sessionStartTime || session.SessionStartTime || getStartTimeFromBooking(session);

    return {
        ...session,
        id: session.id || session.Id || `local-session-${Date.now()}`,
        therapistId: session.therapistId || session.TherapistId,
        startTime,
        sessionStartTime: startTime,
        endTime: session.endTime || session.sessionEndTime || session.SessionEndTime,
        status: normalizeStatus(session.status ?? session.Status ?? "PENDING"),
        therapist: {
            ...therapist,
            id: therapist.id || therapist.Id || session.therapistId || session.TherapistId,
            fullName:
                therapist.fullName ||
                therapist.FullName ||
                user.fullName ||
                user.FullName ||
                "Zakir Aliyev",
            specialization:
                therapist.specialization ||
                therapist.Specialization ||
                "Fizioterapevt",
            avatar: therapist.avatar || therapist.Avatar || user.avatar || user.Avatar || "",
        },
    };
};

const saveLocalSession = (session) => {
    const normalized = normalizeSession(session);
    const sessions = readLocalSessions().filter((item) => item.id !== normalized.id);
    writeLocalSessions([normalized, ...sessions]);
    return normalized;
};

const mergeSessions = (remoteSessions) => {
    const remote = (Array.isArray(remoteSessions) ? remoteSessions : []).map(normalizeSession);
    const local = readLocalSessions().map(normalizeSession);
    const remoteIds = new Set(remote.map((session) => session.id));
    return [...local.filter((session) => !remoteIds.has(session.id)), ...remote];
};

// User Endpoints
export const createSession = async (data) => {
    try {
        const created = await api.post("/therapy-sessions", data);
        return saveLocalSession({
            ...created,
            ...data,
            id: created?.id || created?.Id || `local-session-${Date.now()}`,
            status: created?.status || created?.Status || "PENDING",
        });
    } catch (error) {
        if (error?.status === 401 || error?.status === 403) {
            throw error;
        }

        console.warn("⚠️ Using mock session booking (API failed)", error?.message);
        return saveLocalSession({
            id: `mock-session-${Date.now()}`,
            therapistId: data.therapistId,
            date: data.date,
            hour: data.hour,
            startTime: getStartTimeFromBooking(data),
            therapist: data.therapistSnapshot,
            status: "PENDING",
            createdAt: new Date().toISOString(),
            isMock: true,
        });
    }
};

export const getAvailableSlots = async (therapistId, from, to) => {
    try {
        return await api.get(`/therapy-sessions/therapist/${therapistId}/available-slots`, {
            params: { from, to }
        });
    } catch (error) {
        console.warn(`⚠️ Using mock data for available slots (API failed)`);
        return MOCK_SESSIONS.filter(s => s.therapistId === therapistId && s.status === "Available");
    }
};

export const getAvailabilitySummary = async (therapistId, year, month) => {
    try {
        return await api.get(`/therapy-sessions/therapist/${therapistId}/availability-summary`, {
            params: { year, month }
        });
    } catch (error) {
        console.warn(`⚠️ Using mock data for availability summary (API failed)`, error?.message);
        return MOCK_AVAILABILITY_SUMMARY;
    }
};

export const getMySessions = async () => {
    try {
        const sessions = await api.get("/therapy-sessions/my-sessions");
        return mergeSessions(sessions);
    } catch (error) {
        console.warn("⚠️ Using mock data for my sessions (API failed)");
        return mergeSessions([]);
    }
};

export const confirmSessionAsUser = async (sessionId) => {
    return api.post(`/therapy-sessions/${sessionId}/confirm-user`);
};

export const cancelSession = async (sessionId) => {
    if (String(sessionId).startsWith("mock-session") || String(sessionId).startsWith("local-session")) {
        writeLocalSessions(readLocalSessions().filter((session) => session.id !== sessionId));
        return { id: sessionId, status: "CANCELLED" };
    }

    try {
        return await api.post(`/therapy-sessions/${sessionId}/cancel`);
    } finally {
        writeLocalSessions(readLocalSessions().filter((session) => session.id !== sessionId));
    }
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
