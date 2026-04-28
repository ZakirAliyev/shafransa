/**
 * SessionStatus Enum - Matches backend SessionStatus.cs
 */
export const SESSION_STATUS = {
  PENDING: 0,
  THERAPIST_CONFIRMED: 1,
  CONFIRMED: 2,
  COMPLETED: 3,
  CANCELLED: 4
};

/**
 * RequestStatus Enum - Matches backend RequestStatus.cs (for Therapist Verification)
 */
export const REQUEST_STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2
};

export const getSessionStatusLabel = (status) => {
  const map = {
    0: "PENDING",
    1: "WAITING_FOR_USER",
    2: "CONFIRMED",
    3: "COMPLETED",
    4: "CANCELLED"
  };
  return map[status] || "UNKNOWN";
};

export const getRequestStatusLabel = (status) => {
  const map = {
    0: "PENDING",
    1: "APPROVED",
    2: "REJECTED"
  };
  return map[status] || "UNKNOWN";
};
