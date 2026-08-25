// Single source of truth for the category vocabulary. To add/rename a category,
// edit only this array — the type and the form's dropdown both derive from it.
export const SOFTWARE_FEEDBACK_CATEGORIES = ['Tính năng', 'Giao diện'] as const;
export type SoftwareFeedbackCategory = (typeof SOFTWARE_FEEDBACK_CATEGORIES)[number];

// Same pattern for type.
export const SOFTWARE_FEEDBACK_TYPES = ['Đề xuất', 'Hiệu chỉnh'] as const;
export type SoftwareFeedbackType = (typeof SOFTWARE_FEEDBACK_TYPES)[number];

export interface SoftwareFeedbackTicket {
  id: string;
  category: SoftwareFeedbackCategory;
  type: SoftwareFeedbackType;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  status?: string;
  response?: string;
}
