export type Role = "super_admin" | "admin" | "operator" | "viewer";

export const ROLES = {
  SUPER_ADMIN: "super_admin" as Role,
  ADMIN: "admin" as Role,
  OPERATOR: "operator" as Role,
  VIEWER: "viewer" as Role,
} as const;

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  operator: "Operator",
  viewer: "Viewer",
};

/** Routes that require at minimum ADMIN role */
const ADMIN_ROUTES = ["/settings/target"];
/** Routes that require SUPER_ADMIN role */
const SUPER_ADMIN_ROUTES = ["/settings/users"];

export function canAccessRoute(role: Role, pathname: string): boolean {
  if (SUPER_ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    return role === "super_admin";
  }
  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    return role === "super_admin" || role === "admin";
  }
  return true; // /dashboard, /analytics — all roles
}

export function hasRole(userRole: Role, ...allowed: Role[]): boolean {
  return allowed.includes(userRole);
}
