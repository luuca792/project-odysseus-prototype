import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { activities as seedActivities } from '../mock-data/activities';
import { badges as seedBadges } from '../mock-data/badges';
import { users as seedUsers } from '../mock-data/users';
import { posts as seedPosts } from '../mock-data/posts';
import { goals as seedGoals } from '../mock-data/goals';
import { subAssociations as seedSubAssociations } from '../mock-data/subAssociations';
import { defaultRolePermissions } from '../mock-data/permissions';
import type {
  Activity,
  Badge,
  Comment,
  Post,
  Goal,
  Permission,
  Role,
  SubAssociation,
  User,
} from '../mock-data/types';

interface AppDataContextValue {
  activities: Activity[];
  badges: Badge[];
  users: User[];
  posts: Post[];
  goals: Goal[];
  subAssociations: SubAssociation[];
  rolePermissions: Record<Role, Permission[]>;

  addActivity: (activity: Activity) => void;
  updateActivity: (activity: Activity) => void;
  deleteActivity: (id: string) => void;
  addParticipant: (activityId: string, userId: string) => void;
  removeParticipant: (activityId: string, userId: string) => void;

  addBadge: (badge: Badge) => void;
  deleteBadge: (badgeId: string) => void;
  assignBadge: (userId: string, badgeId: string) => void;
  removeBadge: (userId: string, badgeId: string) => void;
  toggleCoreMember: (userId: string) => void;

  addPost: (post: Post) => void;
  addComment: (postId: string, comment: Comment) => void;
  setForumStatus: (postId: string, status: 'published' | 'hidden') => void;
  setFeedbackStatus: (postId: string, status: 'new' | 'reviewed') => void;
  deletePost: (postId: string) => void;

  addGoal: (goal: Goal) => void;
  assignActivityToGoal: (goalId: string, activityId: string) => void;
  removeActivityFromGoal: (goalId: string, activityId: string) => void;

  addSubAssociation: (sa: SubAssociation) => void;
  addUser: (user: User) => void;
  setUserRole: (userId: string, role: Role) => void;
  togglePermission: (role: Role, permission: Permission) => void;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>(seedActivities);
  const [badges, setBadges] = useState<Badge[]>(seedBadges);
  const [users, setUsers] = useState<User[]>(seedUsers);
  const [posts, setPosts] = useState<Post[]>(seedPosts);
  const [goals, setGoals] = useState<Goal[]>(seedGoals);
  const [subAssociations, setSubAssociations] = useState<SubAssociation[]>(seedSubAssociations);
  const [rolePermissions, setRolePermissions] = useState<Record<Role, Permission[]>>(defaultRolePermissions);

  const value = useMemo<AppDataContextValue>(
    () => ({
      activities,
      badges,
      users,
      posts,
      goals,
      subAssociations,
      rolePermissions,

      addActivity: (activity) => setActivities((prev) => [activity, ...prev]),
      updateActivity: (activity) =>
        setActivities((prev) => prev.map((a) => (a.id === activity.id ? activity : a))),
      deleteActivity: (id) => setActivities((prev) => prev.filter((a) => a.id !== id)),
      addParticipant: (activityId, userId) =>
        setActivities((prev) =>
          prev.map((a) =>
            a.id === activityId && !a.participantIds.includes(userId)
              ? { ...a, participantIds: [...a.participantIds, userId] }
              : a,
          ),
        ),
      removeParticipant: (activityId, userId) =>
        setActivities((prev) =>
          prev.map((a) =>
            a.id === activityId
              ? { ...a, participantIds: a.participantIds.filter((id) => id !== userId) }
              : a,
          ),
        ),

      addBadge: (badge) => setBadges((prev) => [badge, ...prev]),
      deleteBadge: (badgeId) => {
        setBadges((prev) => prev.filter((b) => b.id !== badgeId));
        setUsers((prev) => prev.map((u) => ({ ...u, badgeIds: u.badgeIds.filter((b) => b !== badgeId) })));
      },
      assignBadge: (userId, badgeId) =>
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId && !u.badgeIds.includes(badgeId)
              ? { ...u, badgeIds: [...u.badgeIds, badgeId] }
              : u,
          ),
        ),
      removeBadge: (userId, badgeId) =>
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, badgeIds: u.badgeIds.filter((b) => b !== badgeId) } : u,
          ),
        ),
      toggleCoreMember: (userId) =>
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isCoreMember: !u.isCoreMember } : u)),
        ),

      addPost: (post) => setPosts((prev) => [post, ...prev]),
      addComment: (postId, comment) =>
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, comment] } : p)),
        ),
      setForumStatus: (postId, status) =>
        setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, status } : p))),
      setFeedbackStatus: (postId, status) =>
        setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, status } : p))),
      deletePost: (postId) => setPosts((prev) => prev.filter((p) => p.id !== postId)),

      addGoal: (goal) => setGoals((prev) => [goal, ...prev]),
      assignActivityToGoal: (goalId, activityId) =>
        setGoals((prev) =>
          prev.map((g) =>
            g.id === goalId && !g.activityIds.includes(activityId)
              ? { ...g, activityIds: [...g.activityIds, activityId] }
              : g,
          ),
        ),
      removeActivityFromGoal: (goalId, activityId) =>
        setGoals((prev) =>
          prev.map((g) =>
            g.id === goalId ? { ...g, activityIds: g.activityIds.filter((id) => id !== activityId) } : g,
          ),
        ),

      addSubAssociation: (sa) => setSubAssociations((prev) => [...prev, sa]),
      addUser: (user) => setUsers((prev) => [...prev, user]),
      setUserRole: (userId, role) =>
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role, bchTitle: undefined } : u))),
      togglePermission: (role, permission) =>
        setRolePermissions((prev) => {
          const current = prev[role];
          const next = current.includes(permission)
            ? current.filter((p) => p !== permission)
            : [...current, permission];
          return { ...prev, [role]: next };
        }),
    }),
    [activities, badges, users, posts, goals, subAssociations, rolePermissions],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
