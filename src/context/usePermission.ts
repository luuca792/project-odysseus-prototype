import { useAuth } from './AuthContext';
import { useAppData } from './AppDataContext';
import type { Permission } from '../mock-data/types';

// Reads the current user's role against the (admin-editable) role -> permission
// map in AppDataContext. This is the single place permission checks should go
// through — don't inline `currentUser.role === 'bch'` in page components.
export function usePermission(permission: Permission): boolean {
  const { currentUser } = useAuth();
  const { rolePermissions } = useAppData();
  if (!currentUser) return false;
  return rolePermissions[currentUser.role]?.includes(permission) ?? false;
}

export function useHasAnyPermission(permissions: Permission[]): boolean {
  const { currentUser } = useAuth();
  const { rolePermissions } = useAppData();
  if (!currentUser) return false;
  const granted = rolePermissions[currentUser.role] ?? [];
  return permissions.some((p) => granted.includes(p));
}
