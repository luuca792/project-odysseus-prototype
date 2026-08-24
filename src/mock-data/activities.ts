import type { Activity } from './types';

// Real events — from business_data/events/*/information.md (date only) and photos.
// Description/location/activity-type/participants/benefits/documents are not part of
// the supplied data and are intentionally left generic/placeholder pending real details.
// `status` is a manually-set field (not derived from `date`) — one of each value is
// assigned here purely so the overview page's three status groups all have content
// to demo; it is not a real reported status from the stakeholder.
export const activities: Activity[] = [
  {
    id: 'act-hoi-thao',
    subAssociationId: 'sa-tv',
    title: 'Hội thao truyền thống Liên chi hội sinh viên Vĩnh Long lần thứ I – năm 2026',
    type: 'sports',
    status: 'ended',
    description: 'Chi tiết hoạt động đang được cập nhật.',
    date: '2026-08-17',
    location: 'Đang cập nhật',
    // Invented placeholder benefits — no real benefits list supplied yet; exercises
    // the "Lợi ích tham gia" section pending stakeholder confirmation.
    benefits: ['Điểm rèn luyện', 'Cộng điểm phong trào Đoàn - Hội'],
    termOfOffice: '2025–2026',
    mediaIds: [
      'img-hoi-thao-1',
      'img-hoi-thao-2',
      'img-hoi-thao-3',
      'img-hoi-thao-4',
      'img-hoi-thao-5',
      'img-hoi-thao-6',
      'img-hoi-thao-7',
      'img-hoi-thao-8',
    ],
    participantIds: ['u-bch-1', 'u-bch-cntt-2', 'u-bch-cntt-3', 'u-member-1', 'u-member-2', 'u-member-3'],
    documentIds: ['doc-hoi-thao-plan', 'doc-hoi-thao-list'],
  },
  {
    id: 'act-lao-dong-hk3',
    subAssociationId: 'sa-tv',
    title: 'Lao động học kỳ III – năm học 2025 – 2026',
    type: 'labor',
    status: 'ongoing',
    description: 'Chi tiết hoạt động đang được cập nhật.',
    date: '2026-07-22',
    location: 'Đang cập nhật',
    benefits: ['Điểm rèn luyện', 'Giờ công tác xã hội'],
    termOfOffice: '2025–2026',
    mediaIds: ['img-lao-dong-1', 'img-lao-dong-2', 'img-lao-dong-3', 'img-lao-dong-4', 'img-lao-dong-5'],
    participantIds: ['u-member-4', 'u-member-5', 'u-member-8', 'u-member-9'],
    documentIds: ['doc-lao-dong-plan'],
  },
  {
    id: 'act-gop-nang-cho-em',
    subAssociationId: 'sa-tv',
    title: 'Hoạt động Góp nắng cho em – năm 2026',
    type: 'volunteer',
    status: 'upcoming',
    description: 'Chi tiết hoạt động đang được cập nhật.',
    date: '2026-07-18',
    location: 'Đang cập nhật',
    benefits: [
      'Điểm rèn luyện',
      'Đạt tiêu chí Tình nguyện tốt của danh hiệu Sinh viên 5 tốt',
      'Giấy chứng nhận tham gia hoạt động tình nguyện',
    ],
    termOfOffice: '2025–2026',
    mediaIds: [
      'img-gop-nang-1',
      'img-gop-nang-2',
      'img-gop-nang-3',
      'img-gop-nang-4',
      'img-gop-nang-5',
      'img-gop-nang-6',
      'img-gop-nang-7',
    ],
    participantIds: ['u-bch-1', 'u-member-1', 'u-member-10', 'u-member-11', 'u-member-12'],
    documentIds: ['doc-gop-nang-plan', 'doc-gop-nang-budget'],
  },
];

export function getActivitiesBySubAssociation(subAssociationId: string): Activity[] {
  return activities.filter((a) => a.subAssociationId === subAssociationId);
}

export function getActivityById(id: string): Activity | undefined {
  return activities.find((a) => a.id === id);
}
