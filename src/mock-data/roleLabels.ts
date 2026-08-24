import type { BchTitle, Role, User } from './types';

// System has exactly 3 functional roles. "bch" carries a real-life title
// (chi hội trưởng / chi hội phó / ủy viên BCH) that is display-only — all three
// function identically within the system and share the same permissions.
export const ROLE_LABELS: Record<Role, string> = {
  member: 'Hội viên',
  bch: 'Ban Chấp Hành',
  admin: 'Quản trị hệ thống',
};

export const BCH_TITLE_LABELS: Record<BchTitle, string> = {
  'chi-hoi-truong': 'Chi hội trưởng',
  'chi-hoi-pho': 'Chi hội phó',
  'uy-vien-bch': 'Ủy viên BCH',
};

// The label to display for a given user: BCH shows their specific real-life title
// (falling back to the generic role label if a title wasn't set), other roles show the role label.
export function getUserRoleLabel(user: Pick<User, 'role' | 'bchTitle'>): string {
  if (user.role === 'bch' && user.bchTitle) {
    return BCH_TITLE_LABELS[user.bchTitle];
  }
  return ROLE_LABELS[user.role];
}
