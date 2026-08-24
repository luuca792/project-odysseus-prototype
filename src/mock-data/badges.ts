import type { Badge } from './types';

export const badges: Badge[] = [
  {
    id: 'b-outstanding-oct',
    subAssociationId: 'sa-tv',
    name: 'Hội viên tiêu biểu T10',
    description: 'Trao cho hội viên có đóng góp nổi bật trong tháng 10.',
    color: '#1f5ca9',
    icon: 'star',
  },
  {
    id: 'b-founder',
    subAssociationId: 'sa-tv',
    name: 'Thành viên sáng lập',
    description: 'Trao cho thành viên BCH nhiệm kỳ đầu tiên của chi hội.',
    color: '#d97706',
    icon: 'crown',
  },
  {
    id: 'b-volunteer-star',
    subAssociationId: 'sa-tv',
    name: 'Ngôi sao tình nguyện',
    description: 'Trao cho hội viên tích cực tham gia các hoạt động tình nguyện.',
    color: '#1f9d55',
    icon: 'heart-handshake',
  },
];

export function getBadgesBySubAssociation(subAssociationId: string): Badge[] {
  return badges.filter((b) => b.subAssociationId === subAssociationId);
}

export function getBadgeById(id: string): Badge | undefined {
  return badges.find((b) => b.id === id);
}
