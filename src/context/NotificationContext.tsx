import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

// Mock "new activity" / "new forum post" indicators. Per prototype scope, this is
// purely simulated: a fixed set of ids starts unread every time the app loads, and
// viewing the item's detail page marks it read for the rest of the session. Since
// this is plain React state (like AuthContext/AppDataContext), a page refresh resets
// it — the dot reappearing on reload is the intended mock behavior, not a bug.
const INITIAL_UNREAD_ACTIVITY_IDS = ['act-gop-nang-cho-em'];
const INITIAL_UNREAD_POST_IDS = ['post-1'];

interface NotificationContextValue {
  hasUnreadActivities: boolean;
  hasUnreadForumPosts: boolean;
  isActivityUnread: (activityId: string) => boolean;
  isPostUnread: (postId: string) => boolean;
  markActivityRead: (activityId: string) => void;
  markPostRead: (postId: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [unreadActivityIds, setUnreadActivityIds] = useState<string[]>(INITIAL_UNREAD_ACTIVITY_IDS);
  const [unreadPostIds, setUnreadPostIds] = useState<string[]>(INITIAL_UNREAD_POST_IDS);

  const value = useMemo<NotificationContextValue>(
    () => ({
      hasUnreadActivities: unreadActivityIds.length > 0,
      hasUnreadForumPosts: unreadPostIds.length > 0,
      isActivityUnread: (activityId) => unreadActivityIds.includes(activityId),
      isPostUnread: (postId) => unreadPostIds.includes(postId),
      markActivityRead: (activityId) =>
        setUnreadActivityIds((prev) => (prev.includes(activityId) ? prev.filter((id) => id !== activityId) : prev)),
      markPostRead: (postId) =>
        setUnreadPostIds((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : prev)),
    }),
    [unreadActivityIds, unreadPostIds],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
