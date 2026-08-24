import type { Permission, Role } from './types';

// Human-readable labels for the fixed permission list, for the Admin permission matrix.
export const PERMISSION_LABELS: Record<Permission, string> = {
  'create-account': 'Tạo tài khoản (xóa tài khoản)',
  'create-association': 'Tạo chi hội (xóa chi hội)',
  'view-newsfeed': 'Xem bảng tin',
  'view-activities': 'Xem hoạt động',
  'manage-activities': 'Tạo hoạt động (sửa, xóa hoạt động)',
  'view-forum': 'Xem diễn đàn (bài viết)',
  'create-post': 'Tạo bài viết (sửa, xóa bài viết)',
  'moderate-posts': 'Kiểm duyệt bài viết',
  'manage-own-feedback': 'Quản lý góp ý cá nhân',
  'view-own-feedback': 'Xem góp ý cá nhân',
  'create-feedback': 'Tạo góp ý (sửa, xóa góp ý)',
  'view-all-feedback': 'Xem toàn bộ góp ý của chi hội',
  'respond-feedback': 'Phản hồi góp ý',
  'view-members': 'Xem thông tin hội viên',
  'view-badges': 'Xem danh sách huy hiệu của chi hội',
  'manage-quota': 'Quản lý chỉ tiêu',
  'create-quota': 'Tạo chỉ tiêu',
  'assign-activity-to-quota': 'Gán hoạt động vào chỉ tiêu',
  'manage-funds': 'Quản lý quỹ',
  'view-funds': 'Xem số quỹ',
  'view-fund-detail': 'Xem chi tiết hoạt động quỹ',
  'generate-documents': 'Tạo bản in',
  'view-association-info': 'Xem thông tin chi hội',
};

export const ALL_PERMISSIONS = Object.keys(PERMISSION_LABELS) as Permission[];

// Default role -> permission assignment, editable at runtime by Admin (see
// AppDataContext's rolePermissions state). This is the seed only.
export const defaultRolePermissions: Record<Role, Permission[]> = {
  admin: ['create-account', 'create-association'],
  bch: [
    'view-newsfeed',
    'view-activities',
    'manage-activities',
    'view-forum',
    'create-post',
    'moderate-posts',
    'manage-own-feedback',
    'view-own-feedback',
    'create-feedback',
    'view-all-feedback',
    'respond-feedback',
    'view-members',
    'view-badges',
    'manage-quota',
    'create-quota',
    'assign-activity-to-quota',
    'manage-funds',
    'view-funds',
    'view-fund-detail',
    'generate-documents',
    'view-association-info',
  ],
  member: [
    'view-newsfeed',
    'view-activities',
    'view-forum',
    'create-post',
    'manage-own-feedback',
    'view-own-feedback',
    'create-feedback',
    'view-association-info',
  ],
};
