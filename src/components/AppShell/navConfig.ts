import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  Users,
  Award,
  MessageSquareText,
  MessagesSquare,
  ShieldCheck,
  Target,
  Wallet,
  FileOutput,
  Settings,
} from 'lucide-react';
import type { Permission, Role } from '../../mock-data/types';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  permission?: Permission;
  // Key into NotificationContext for a mock "new content" red dot on this nav item.
  notificationKey?: 'activities' | 'forum';
}

export interface NavGroup {
  label: string;
  items: (NavItem | NavGroup)[];
}

export type NavEntry = NavItem | NavGroup;

export function isNavGroup(entry: NavEntry): entry is NavGroup {
  return 'items' in entry;
}

// Items every logged-in member/executive sees, in this order (subject to permission
// checks below). "Hồ sơ cá nhân" lives in the account dropdown, not in the sidebar.
const memberItems: NavItem[] = [
  { to: '/', label: 'Bảng tin', icon: LayoutDashboard, permission: 'view-newsfeed' },
  { to: '/activities', label: 'Hoạt động', icon: CalendarDays, permission: 'view-activities', notificationKey: 'activities' },
  { to: '/forum', label: 'Diễn đàn', icon: MessagesSquare, permission: 'view-forum', notificationKey: 'forum' },
  { to: '/feedback', label: 'Góp ý & phản hồi', icon: MessageSquareText, permission: 'view-own-feedback' },
  { to: '/sub-association', label: 'Thông tin chi hội', icon: Building2, permission: 'view-association-info' },
];

// Executive-only section, shown below a divider after the member items.
const executiveGroup: NavGroup = {
  label: 'Công tác hội',
  items: [
    { to: '/members', label: 'Hội viên', icon: Users, permission: 'view-members' },
    { to: '/badges', label: 'Huy hiệu', icon: Award, permission: 'view-badges' },
    { to: '/forum/moderation', label: 'Kiểm duyệt diễn đàn', icon: ShieldCheck, permission: 'moderate-posts' },
    {
      label: 'Tiện ích',
      items: [
        { to: '/quota', label: 'Chỉ tiêu', icon: Target, permission: 'manage-quota' },
        { to: '/funds', label: 'Quỹ chi hội', icon: Wallet, permission: 'view-funds' },
        { to: '/documents', label: 'Tạo bản in', icon: FileOutput, permission: 'generate-documents' },
      ],
    },
  ],
};

const adminItem: NavItem = { to: '/admin', label: 'Quản trị hệ thống', icon: Settings };

// Filters a nav tree down to items the given permission set grants access to,
// dropping empty groups. Items without a `permission` are always shown.
function filterByPermissions(entries: NavEntry[], granted: Permission[]): NavEntry[] {
  const result: NavEntry[] = [];
  for (const entry of entries) {
    if (isNavGroup(entry)) {
      const items = filterByPermissions(entry.items, granted);
      if (items.length > 0) result.push({ ...entry, items });
    } else if (!entry.permission || granted.includes(entry.permission)) {
      result.push(entry);
    }
  }
  return result;
}

export function getNavSections(role: Role, grantedPermissions: Permission[]): NavEntry[] {
  if (role === 'admin') return [{ to: '/', label: 'Bảng tin', icon: LayoutDashboard }, adminItem];
  const base = role === 'bch' ? [...memberItems, executiveGroup] : memberItems;
  return filterByPermissions(base, grantedPermissions);
}
