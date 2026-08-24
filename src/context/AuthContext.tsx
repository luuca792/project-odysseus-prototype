import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { users } from '../mock-data/users';
import type { User } from '../mock-data/types';

interface AuthContextValue {
  currentUser: User | null;
  // The chi hội currently being viewed/managed, for users with multiple memberships.
  // Defaults to the user's first membership on login; null for admin (no membership).
  activeSubAssociationId: string | null;
  setActiveSubAssociationId: (id: string) => void;
  login: (userId: string) => void;
  logout: () => void;
  demoAccounts: User[];
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeSubAssociationId, setActiveSubAssociationIdState] = useState<string | null>(null);

  const value = useMemo<AuthContextValue>(() => {
    const currentUser = users.find((u) => u.id === currentUserId) ?? null;
    return {
      currentUser,
      activeSubAssociationId,
      setActiveSubAssociationId: setActiveSubAssociationIdState,
      login: (userId: string) => {
        setCurrentUserId(userId);
        const user = users.find((u) => u.id === userId);
        setActiveSubAssociationIdState(user?.subAssociationIds[0] ?? null);
      },
      logout: () => {
        setCurrentUserId(null);
        setActiveSubAssociationIdState(null);
      },
      demoAccounts: users,
    };
  }, [currentUserId, activeSubAssociationId]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
