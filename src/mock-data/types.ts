export type Role = 'member' | 'bch' | 'admin';

// Real-life labels within the "bch" role — same permissions system-wide, different display label.
export type BchTitle = 'chi-hoi-truong' | 'chi-hoi-pho' | 'uy-vien-bch';

export type ActivityType = 'volunteer' | 'meeting' | 'organizational' | 'sports' | 'labor';

// Lifecycle status of an activity — set manually by BCH (not derived from `date`),
// since a real event's date can be in the past relative to "today" while still being
// the one currently being organized/reported on.
export type ActivityStatus = 'upcoming' | 'ongoing' | 'ended';

// Permission is a system concept: the fixed list below is coded by developers, not
// user-created. Admin can change which permissions a Role has (see AppDataContext's
// rolePermissions state), but cannot invent new permissions from the UI.
// Mirrors the "Quyền" list from specification.docx's "Cách vận hành" section.
export type Permission =
  | 'create-account' // Tạo tài khoản (xóa tài khoản)
  | 'create-association' // Tạo chi hội (xóa chi hội)
  | 'view-newsfeed' // Xem bảng tin
  | 'view-activities' // Xem hoạt động
  | 'manage-activities' // Tạo hoạt động (sửa, xóa hoạt động)
  | 'view-forum' // Xem diễn đàn (bài viết)
  | 'create-post' // Tạo bài viết (sửa, xóa bài viết)
  | 'moderate-posts' // Kiểm duyệt bài viết
  | 'manage-own-feedback' // Quản lý góp ý cá nhân
  | 'view-own-feedback' // Xem góp ý cá nhân
  | 'create-feedback' // Tạo góp ý (sửa, xóa góp ý)
  | 'view-all-feedback' // Xem toàn bộ góp ý của chi hội
  | 'respond-feedback' // Phản hồi góp ý
  | 'view-members' // Xem thông tin hội viên
  | 'view-badges' // Xem danh sách huy hiệu của chi hội
  | 'manage-quota' // Quản lý chỉ tiêu
  | 'create-quota' // Tạo chỉ tiêu
  | 'assign-activity-to-quota' // Gán hoạt động vào chỉ tiêu
  | 'manage-funds' // Quản lý quỹ
  | 'view-funds' // Xem số quỹ
  | 'view-fund-detail' // Xem chi tiết hoạt động quỹ
  | 'generate-documents' // Tạo bản in
  | 'view-association-info'; // Xem thông tin chi hội

export interface SubAssociation {
  id: string;
  name: string;
  shortName: string;
  slogan: string;
  introduction: string;
  contactEmail: string;
  facebookUrl: string;
  zaloUrl: string;
  termOfOffice: string;
}

export interface User {
  id: string;
  name: string;
  role: Role;
  bchTitle?: BchTitle;
  // A member (Thành viên) can belong to 1+ sub-associations (chi hội); admin has none.
  subAssociationIds: string[];
  email: string;
  avatarInitials: string;
  bio: string;
  studentId?: string;
  major?: string;
  isCoreMember: boolean;
  badgeIds: string[];
}

// Generic attachment entity (Tài liệu / Media): images, documents, etc.
// Linkable to an Activity today; modeled generically per the spec so the shape
// doesn't need to change if posts/comments gain attachments later.
export type MediaKind = 'image' | 'document';

export interface Media {
  id: string;
  kind: MediaKind;
  // Image: resolved bundled photo URL, or undefined for a gradient placeholder tile.
  url?: string;
  // Document: display filename + human-readable size.
  filename?: string;
  size?: string;
}

export interface Activity {
  id: string;
  subAssociationId: string;
  title: string;
  type: ActivityType;
  status: ActivityStatus;
  description: string;
  date: string;
  location: string;
  // Lợi ích tham gia — what a student gains from joining (e.g. "Điểm rèn luyện",
  // "Đạt tiêu chí Tình nguyện tốt của danh hiệu Sinh viên 5 tốt").
  benefits: string[];
  termOfOffice: string;
  mediaIds: string[];
  participantIds: string[];
  // BCH-only organizational documents (kế hoạch, dự trù kinh phí...), referenced by Media id.
  documentIds: string[];
}

export interface Badge {
  id: string;
  subAssociationId: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

// Post (Bài viết) is the unified technical entity for both forum posts ("diễn đàn")
// and feedback/suggestions ("góp ý"), distinguished by postType. Comments always
// belong to a Post — feedback-type posts just don't surface a comment composer in the UI.
export type PostType = 'forum' | 'feedback';
export type ForumStatus = 'published' | 'hidden';
export type FeedbackStatus = 'new' | 'reviewed';

export interface Post {
  id: string;
  subAssociationId: string;
  authorId: string;
  postType: PostType;
  title: string;
  topic: string;
  content: string;
  createdAt: string;
  status: ForumStatus | FeedbackStatus;
  comments: Comment[];
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface FundEntry {
  id: string;
  subAssociationId: string;
  termOfOffice: string;
  startingBalance: number;
  expenses: { activityId: string | null; label: string; amount: number; date: string }[];
}

// Chỉ tiêu (Goal): belongs to one term of office, has N activities assigned to it.
// Replaces the earlier flat target/completed count pair.
export interface Goal {
  id: string;
  subAssociationId: string;
  termOfOffice: string;
  name: string;
  activityIds: string[];
}
