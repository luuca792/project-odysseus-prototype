import type { SubAssociation } from './types';

// Real organization — from business_data/organization.md.
// Chi hội sinh viên Trà Vinh is a chapter under Liên chi hội sinh viên Vĩnh Long,
// itself under Hội Sinh Viên Đại học Cần Thơ. It manages students from Trà Vinh
// province originally from Trà Vinh ward and a few nearby smaller wards.
export const subAssociations: SubAssociation[] = [
  {
    id: 'sa-tv',
    name: 'Chi hội sinh viên Trà Vinh',
    slogan: 'Đoàn kết - Năng động - Nhiệt huyết',
    introduction:
      'Chi hội trực thuộc Liên chi hội sinh viên Vĩnh Long, thuộc Hội Sinh Viên Đại học Cần Thơ. Liên chi hội sinh viên Vĩnh Long quản lý sinh viên đến từ tỉnh Trà Vinh, đang học tập tại Đại học Cần Thơ, và được chia thành nhiều chi hội theo địa bàn. Chi hội sinh viên Trà Vinh quản lý sinh viên đến từ phường Trà Vinh (cùng tên với tỉnh Trà Vinh) và một số phường nhỏ khác.',
    contactEmail: 'chsvtptravinh@gmail.com',
    facebookUrl: 'https://www.facebook.com/chsvtptravinh.ctu',
    zaloUrl: 'https://zalo.me/g/vjpukc977',
    termOfOffice: '2025–2026',
  },
];
