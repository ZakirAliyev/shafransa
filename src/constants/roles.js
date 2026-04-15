/**
 * Role mapping - Converts numeric role IDs from backend to role names
 * Backend sends roles as enum values (integers)
 * 
 * Backend Role Enum (C#):
 * 0 = Admin
 * 1 = Editor
 * 2 = Seller
 * 3 = Member
 */

export const ROLE_MAP = {
  0: "ADMIN",      // System Administrator
  1: "EDITOR",     // Content Editor
  2: "SELLER",     // Seller/Institution
  3: "MEMBER",     // Regular User/Consumer
};

export const ROLE_NAMES = {
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
  SELLER: "SELLER",
  MEMBER: "MEMBER",
};

/**
 * Convert numeric role ID or string role to standard role name
 * @param {number|string} role - Role ID from backend or role name
 * @returns {string} Normalized role name (ADMIN, EDITOR, SELLER, or MEMBER)
 */
export const getRoleName = (role) => {
  // If it's already a string, normalize to uppercase
  if (typeof role === "string") {
    return role.toUpperCase();
  }
  
  // If it's a number, map it
  if (typeof role === "number") {
    return ROLE_MAP[role] || "MEMBER";
  }
  
  // Fallback
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
