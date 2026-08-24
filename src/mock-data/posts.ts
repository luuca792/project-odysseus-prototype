import type { Post } from './types';

// Post (Bài viết): the unified technical entity for forum posts ("diễn đàn") and
// feedback/suggestions ("góp ý"), distinguished by postType — per specification.docx's
// "Ý nghĩa và mối tương quan các thực thể" note. Replaces the earlier separate
// forumPosts.ts / feedback.ts mock files.
export const posts: Post[] = [
  {
    id: 'post-1',
    subAssociationId: 'sa-tv',
    authorId: 'u-member-2',
    postType: 'forum',
    title: 'Có ai biết lịch đăng ký học phần kỳ tới chưa?',
    topic: 'Đời sống sinh viên',
    content:
      'Mình nghe nói phòng đào tạo sắp mở cổng đăng ký học phần, có ai có thông tin chính xác về ngày giờ không ạ?',
    createdAt: '2025-08-10T09:00:00Z',
    status: 'published',
    comments: [
      {
        id: 'c-1',
        authorId: 'u-member-3',
        content: 'Mình nghe là tuần sau, để mình hỏi lại phòng đào tạo rồi báo lại nhé.',
        createdAt: '2025-08-10T10:30:00Z',
      },
      {
        id: 'c-2',
        authorId: 'u-bch-1',
        content: 'Chi hội sẽ đăng thông báo chính thức khi có lịch nhé mọi người.',
        createdAt: '2025-08-10T11:15:00Z',
      },
    ],
  },
  {
    id: 'post-2',
    subAssociationId: 'sa-tv',
    authorId: 'u-member-4',
    postType: 'forum',
    title: 'Chia sẻ kinh nghiệm phỏng vấn thực tập',
    topic: 'Hoạt động chi hội',
    content:
      'Vừa rồi mình phỏng vấn thực tập ở một công ty phần mềm, xin chia sẻ vài kinh nghiệm cho các bạn năm sau.',
    createdAt: '2025-08-15T14:00:00Z',
    status: 'published',
    comments: [
      {
        id: 'c-3',
        authorId: 'u-member-5',
        content: 'Cảm ơn bạn đã chia sẻ, rất hữu ích!',
        createdAt: '2025-08-15T15:00:00Z',
      },
    ],
  },
  {
    id: 'post-3',
    subAssociationId: 'sa-tv',
    authorId: 'u-member-3',
    postType: 'forum',
    title: 'Spam quảng cáo khóa học ngoài',
    topic: 'Khác',
    content: 'Nội dung không phù hợp, đã được BCH ẩn khỏi diễn đàn.',
    createdAt: '2025-08-18T08:00:00Z',
    status: 'hidden',
    comments: [],
  },
  {
    id: 'post-4',
    subAssociationId: 'sa-tv',
    authorId: 'u-member-8',
    postType: 'forum',
    title: 'Góp ý về hoạt động Góp nắng cho em',
    topic: 'Hoạt động chi hội',
    content: 'Mình thấy hoạt động rất ý nghĩa, mong chi hội tổ chức thêm các buổi thiện nguyện tương tự định kỳ.',
    createdAt: '2026-07-19T10:00:00Z',
    status: 'published',
    comments: [
      {
        id: 'c-4',
        authorId: 'u-bch-1',
        content: 'Cảm ơn góp ý của bạn, BCH sẽ cân nhắc đưa vào kế hoạch quý sau.',
        createdAt: '2026-07-19T13:00:00Z',
      },
    ],
  },
  {
    id: 'fb-1',
    subAssociationId: 'sa-tv',
    authorId: 'u-member-1',
    postType: 'feedback',
    title: 'Góp ý về hoạt động',
    topic: 'Hoạt động',
    content: 'Mong chi hội tổ chức thêm các buổi workshop kỹ năng mềm cho sinh viên năm nhất.',
    createdAt: '2025-08-01T09:00:00Z',
    status: 'reviewed',
    comments: [],
  },
  {
    id: 'fb-2',
    subAssociationId: 'sa-tv',
    authorId: 'u-member-5',
    postType: 'feedback',
    title: 'Góp ý về truyền thông',
    topic: 'Truyền thông',
    content: 'Kênh thông báo hoạt động hiện tại khá rời rạc, nên gộp về một nơi duy nhất.',
    createdAt: '2025-08-14T09:00:00Z',
    status: 'new',
    comments: [],
  },
  {
    id: 'fb-3',
    subAssociationId: 'sa-tv',
    authorId: 'u-member-4',
    postType: 'feedback',
    title: 'Đề xuất quỹ hỗ trợ',
    topic: 'Khác',
    content: 'Đề xuất chi hội có thêm quỹ hỗ trợ sinh viên khó khăn tham gia hoạt động tình nguyện.',
    createdAt: '2025-08-19T09:00:00Z',
    status: 'new',
    comments: [],
  },
];

export function getPostsBySubAssociation(subAssociationId: string): Post[] {
  return posts.filter((p) => p.subAssociationId === subAssociationId);
}

export function getPostById(id: string): Post | undefined {
  return posts.find((p) => p.id === id);
}
