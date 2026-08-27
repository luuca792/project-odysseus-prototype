import type { ChatMessage } from './types';

// Invented placeholder discussion to exercise the BCH-only group chat UI —
// not real correspondence. Seeded per real activity id; scoped and disposable
// (see AppDataContext: dropped whenever the owning activity is deleted).
export const chatMessages: ChatMessage[] = [
  {
    id: 'chat-hoi-thao-1',
    activityId: 'act-hoi-thao',
    authorId: 'u-bch-1',
    content: 'Mọi người xác nhận giúp mình danh sách đội hình tham gia hội thao trước thứ 6 nhé.',
    createdAt: '2026-08-10T09:00:00.000Z',
  },
  {
    id: 'chat-hoi-thao-2',
    activityId: 'act-hoi-thao',
    authorId: 'u-bch-cntt-2',
    content: 'Bên mình đã liên hệ đặt nước uống cho các đội rồi, dự kiến giao sáng hôm đó.',
    createdAt: '2026-08-10T09:12:00.000Z',
  },
  {
    id: 'chat-hoi-thao-3',
    activityId: 'act-hoi-thao',
    authorId: 'u-bch-cntt-3',
    content: 'Mình sẽ phụ trách khâu đón tiếp Liên chi hội các đơn vị bạn.',
    createdAt: '2026-08-10T09:20:00.000Z',
  },

  {
    id: 'chat-lao-dong-hk3-1',
    activityId: 'act-lao-dong-hk3',
    authorId: 'u-bch-1',
    content: 'Buổi lao động kỳ này cần chuẩn bị thêm bao tay và chổi, ai còn dư dụng cụ báo mình với.',
    createdAt: '2026-07-18T14:00:00.000Z',
  },
  {
    id: 'chat-lao-dong-hk3-2',
    activityId: 'act-lao-dong-hk3',
    authorId: 'u-bch-cntt-3',
    content: 'Mình đã nhắn nhóm trưởng từng khu vực điểm danh giúp rồi nha.',
    createdAt: '2026-07-18T14:05:00.000Z',
  },

  {
    id: 'chat-gop-nang-cho-em-1',
    activityId: 'act-gop-nang-cho-em',
    authorId: 'u-bch-1',
    content: 'Danh sách quà tặng cho các em đã chốt xong, gửi mọi người xem lại trước khi in.',
    createdAt: '2026-07-14T10:00:00.000Z',
  },
  {
    id: 'chat-gop-nang-cho-em-2',
    activityId: 'act-gop-nang-cho-em',
    authorId: 'u-bch-cntt-2',
    content: 'Ok chị, em kiểm tra lại số lượng theo từng lớp rồi phản hồi lại nhóm.',
    createdAt: '2026-07-14T10:15:00.000Z',
  },
  {
    id: 'chat-gop-nang-cho-em-3',
    activityId: 'act-gop-nang-cho-em',
    authorId: 'u-bch-cntt-3',
    content: 'Xe di chuyển hôm đó mình đã book xong, 7h sáng tập trung tại sảnh nhé mọi người.',
    createdAt: '2026-07-14T10:22:00.000Z',
  },
];
