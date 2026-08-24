import type { Goal } from './types';

// Chỉ tiêu (Goal): belongs to one term of office, has N activities assigned to it —
// per specification.docx's data design table. Replaces the earlier flat
// target/completed activity-count pair.
//
// No real goal names/targets were supplied by the stakeholder yet, so these are
// clearly-invented placeholder goals (following the same pattern as the invented
// BCH-only document names) purely to exercise the "assign activity to goal" feature —
// the 3 real activities are distributed across them as an example.
export const goals: Goal[] = [
  {
    id: 'goal-tinh-nguyen',
    subAssociationId: 'sa-tv',
    termOfOffice: '2025–2026',
    name: 'Tổ chức hoạt động tình nguyện (đang cập nhật số liệu chính thức)',
    activityIds: ['act-lao-dong-hk3', 'act-gop-nang-cho-em'],
  },
  {
    id: 'goal-phong-trao',
    subAssociationId: 'sa-tv',
    termOfOffice: '2025–2026',
    name: 'Tổ chức hoạt động phong trào, thể thao (đang cập nhật số liệu chính thức)',
    activityIds: ['act-hoi-thao'],
  },
];

export function getGoalsBySubAssociation(subAssociationId: string): Goal[] {
  return goals.filter((g) => g.subAssociationId === subAssociationId);
}
