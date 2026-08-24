import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePermission } from '../../context/usePermission';
import type { Permission, Role } from '../../mock-data/types';

interface RoleGuardProps {
  // Prefer `permission` for feature-level access (checked against the admin-editable
  // role -> permission map). Use `allow` only for routes that are inherently
  // role-specific rather than permission-gated (e.g. /admin).
  permission?: Permission;
  allow?: Role[];
  children: ReactNode;
}

export function RoleGuard({ permission, allow, children }: RoleGuardProps) {
  const { currentUser } = useAuth();
  const hasPermission = usePermission(permission ?? 'view-newsfeed');

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (allow && !allow.includes(currentUser.role)) {
    return <Navigate to="/403" replace />;
  }
  if (permission && !hasPermission) {
    return <Navigate to="/403" replace />;
  }
  return <>{children}</>;
}
