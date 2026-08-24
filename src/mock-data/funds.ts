import type { FundEntry } from './types';

export const fundEntries: FundEntry[] = [
  {
    id: 'fund-tv-2024',
    subAssociationId: 'sa-tv',
    termOfOffice: '2025–2026',
    startingBalance: 15000000,
    expenses: [
      { activityId: 'act-gop-nang-cho-em', label: 'Hoạt động Góp nắng cho em', amount: 4200000, date: '2026-07-18' },
      { activityId: 'act-lao-dong-hk3', label: 'Lao động học kỳ III', amount: 1200000, date: '2026-07-22' },
      { activityId: 'act-hoi-thao', label: 'Hội thao truyền thống Liên chi hội', amount: 2500000, date: '2026-08-17' },
    ],
  },
];

export function getFundEntry(subAssociationId: string): FundEntry | undefined {
  return fundEntries.find((f) => f.subAssociationId === subAssociationId);
}
