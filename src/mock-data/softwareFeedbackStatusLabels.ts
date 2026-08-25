interface StatusConfig {
  value: string;
  label: string;
  tone: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

// Single source of truth for KNOWN statuses, matching the ticket life cycle:
// Đang mở -> Đang xử lý -> Đã xử lý / Đã từ chối / Đã đóng. To add a new
// recognized status or change a label/color, edit only this array. A ticket's
// `status` field that isn't listed here still displays — see getStatusDisplay's
// fallback below.
export const KNOWN_SOFTWARE_FEEDBACK_STATUSES: StatusConfig[] = [
  { value: 'open', label: 'Đang mở', tone: 'info' },
  { value: 'processing', label: 'Đang xử lý', tone: 'warning' },
  { value: 'resolved', label: 'Đã xử lý', tone: 'success' },
  { value: 'rejected', label: 'Đã từ chối', tone: 'error' },
  { value: 'closed', label: 'Đã đóng', tone: 'neutral' },
];

// Renders any status value: known statuses (matched against the array above) get
// the beautified label+tone; anything else — including future/typo'd dev-entered
// values — renders raw, as-is, with a neutral tone (never crashes, never hides it).
// A missing/empty status (the developer hasn't triaged the ticket yet) returns
// null so the caller shows no badge at all, rather than a placeholder one.
export function getStatusDisplay(status?: string): { label: string; tone: StatusConfig['tone'] } | null {
  if (!status) return null;
  const known = KNOWN_SOFTWARE_FEEDBACK_STATUSES.find((s) => s.value === status);
  return known ? { label: known.label, tone: known.tone } : { label: status, tone: 'neutral' };
}
