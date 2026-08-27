import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface ChatWidgetContextValue {
  isOpen: boolean;
  activeActivityId: string | null;
  /** Bumped on every openChat(activityId) call, even if activityId is unchanged,
   * so ChatWidget can reliably jump to that group's conversation every time. */
  openRequestId: number;
  openChat: (activityId?: string) => void;
  closeChat: () => void;
  toggleChat: () => void;
  selectGroup: (activityId: string) => void;
}

const ChatWidgetContext = createContext<ChatWidgetContextValue | undefined>(undefined);

export function ChatWidgetProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeActivityId, setActiveActivityId] = useState<string | null>(null);
  const [openRequestId, setOpenRequestId] = useState(0);

  const value = useMemo<ChatWidgetContextValue>(
    () => ({
      isOpen,
      activeActivityId,
      openRequestId,
      openChat: (activityId) => {
        setIsOpen(true);
        if (activityId) {
          setActiveActivityId(activityId);
          setOpenRequestId((n) => n + 1);
        }
      },
      closeChat: () => setIsOpen(false),
      toggleChat: () => setIsOpen((v) => !v),
      selectGroup: (activityId) => setActiveActivityId(activityId),
    }),
    [isOpen, activeActivityId, openRequestId],
  );

  return <ChatWidgetContext.Provider value={value}>{children}</ChatWidgetContext.Provider>;
}

export function useChatWidget(): ChatWidgetContextValue {
  const ctx = useContext(ChatWidgetContext);
  if (!ctx) throw new Error('useChatWidget must be used within ChatWidgetProvider');
  return ctx;
}
