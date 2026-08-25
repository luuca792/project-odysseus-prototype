import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import type {
  SoftwareFeedbackCategory,
  SoftwareFeedbackTicket,
  SoftwareFeedbackType,
} from '../mock-data/softwareFeedback';

const API_BASE = '/api/software-feedback';
const FETCH_ERROR_MESSAGE = 'Không thể kết nối đến máy chủ dev. Đảm bảo bạn đang chạy npm run dev.';

interface UseSoftwareFeedbackResult {
  tickets: SoftwareFeedbackTicket[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addTicket: (input: { category: SoftwareFeedbackCategory; type: SoftwareFeedbackType; content: string }) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
}

export function useSoftwareFeedback(): UseSoftwareFeedbackResult {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState<SoftwareFeedbackTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Bad response');
      setTickets(await res.json());
    } catch {
      setError(FETCH_ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTicket = useCallback(
    async (input: { category: SoftwareFeedbackCategory; type: SoftwareFeedbackType; content: string }) => {
      if (!currentUser) throw new Error('Not logged in.');
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...input,
          authorId: currentUser.id,
          authorName: currentUser.name,
        }),
      });
      if (!res.ok) throw new Error('Failed to create ticket.');
      const created: SoftwareFeedbackTicket = await res.json();
      setTickets((prev) => [created, ...prev]);
    },
    [currentUser],
  );

  const deleteTicket = useCallback(
    async (id: string) => {
      if (!currentUser) throw new Error('Not logged in.');
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorId: currentUser.id }),
      });
      if (!res.ok && res.status !== 404) throw new Error('Failed to delete ticket.');
      setTickets((prev) => prev.filter((t) => t.id !== id));
    },
    [currentUser],
  );

  return { tickets, loading, error, refresh, addTicket, deleteTicket };
}
