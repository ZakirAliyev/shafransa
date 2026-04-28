/**
 * Role mapping - Converts numeric role IDs from backend to role names
 * Backend sends roles as enum values (integers)
 * 
 * Backend Role Enum (C#):
 * 0 = SuperAdmin
 * 1 = Admin
 * 2 = Therapist
 * 3 = Member
 */

export const ROLE_MAP = {
  0: "SUPERADMIN",
  1: "ADMIN",
  2: "THERAPIST",
  3: "MEMBER",
};

export const ROLE_NAMES = {
  SUPERADMIN: "SUPERADMIN",
  ADMIN: "ADMIN",
  THERAPIST: "THERAPIST",
  MEMBER: "MEMBER",
};

/**
 * Convert numeric role ID or string role to standard role name
 * @param {number|string} role - Role ID from backend or role name
 * @returns {string} Normalized role name
 */
export const getRoleName = (role) => {
  if (role === null || role === undefined) return "MEMBER";

  // If it's already a string, normalize to uppercase
  if (typeof role === "string") {
    const upper = role.toUpperCase();
    // Handle cases where backend might send "SuperAdmin" instead of 0
    if (Object.values(ROLE_NAMES).includes(upper)) return upper;
    
    // Check if it's a numeric string
    if (!isNaN(Number(role))) return ROLE_MAP[Number(role)] || "MEMBER";
    
    return upper;
  }
  
  // If it's a number, map it
  if (typeof role === "number") {
    return ROLE_MAP[role] || "MEMBER";
  }
  
  return "MEMBER";
};

/**
 * Check if user has specific role(s)
 * @param {number|string} userRole - User's role
 * @param {string|Array<string>} allowedRoles - Allowed role(s)
 * @returns {boolean}
 */
export const hasRole = (userRole, allowedRoles) => {
  const normalizedRole = getRoleName(userRole);
  
  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(normalizedRole);
  }
  
  return normalizedRole === getRoleName(allowedRoles);
};
