import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Image, MessageCircle, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useChatWidget } from '../../context/ChatWidgetContext';
import { usePermission } from '../../context/usePermission';
import { getUserById } from '../../mock-data/users';
import styles from './ChatWidget.module.css';

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ChatWidget() {
  const canManage = usePermission('manage-activities');
  const { currentUser } = useAuth();
  const { activities, chatMessages, sendChatMessage } = useAppData();
  const { isOpen, activeActivityId, openRequestId, toggleChat, selectGroup } = useChatWidget();
  const [draft, setDraft] = useState('');
  const [view, setView] = useState<'list' | 'conversation'>('list');

  // openRequestId is bumped on every openChat(activityId) call (e.g. the
  // "Mở đoạn chat" button on ActivityDetail) so this always jumps to that
  // group's conversation, even when it's already the active group.
  useEffect(() => {
    if (openRequestId > 0) setView('conversation');
  }, [openRequestId]);

  if (!canManage || !currentUser) return null;

  const activeActivity = activities.find((a) => a.id === activeActivityId) ?? activities[0] ?? null;

  const messages = activeActivity
    ? chatMessages
        .filter((m) => m.activityId === activeActivity.id)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    : [];

  function lastMessagePreview(activityId: string): { senderName: string | null; text: string } {
    const groupMessages = chatMessages.filter((m) => m.activityId === activityId);
    if (groupMessages.length === 0) return { senderName: null, text: 'Chưa có tin nhắn' };
    const last = groupMessages[groupMessages.length - 1];
    const author = getUserById(last.authorId);
    const senderName = last.authorId === currentUser?.id ? 'Bạn' : (author?.name ?? 'Người dùng ẩn danh');
    return { senderName, text: last.content };
  }

  function handleSelectGroup(activityId: string) {
    selectGroup(activityId);
    setView('conversation');
  }

  function submit() {
    const trimmed = draft.trim();
    if (!trimmed || !activeActivity || !currentUser) return;
    sendChatMessage(activeActivity.id, currentUser.id, trimmed);
    setDraft('');
  }

  return (
    <div className={`${styles.widget} ${isOpen ? styles.widgetOpen : ''}`}>
      <button type="button" className={styles.bar} onClick={toggleChat} aria-expanded={isOpen}>
        <span className={styles.barLabel}>
          <MessageCircle size={16} /> Thảo luận
        </span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>

      {isOpen && (
        <div className={styles.panel} data-view={view}>
          <div className={styles.groupList}>
            {activities.length === 0 ? (
              <p className={styles.emptyGroups}>Chưa có hoạt động nào.</p>
            ) : (
              activities.map((activity) => {
                const preview = lastMessagePreview(activity.id);
                return (
                  <button
                    key={activity.id}
                    type="button"
                    className={`${styles.groupItem} ${activeActivity?.id === activity.id ? styles.groupItemActive : ''}`}
                    onClick={() => handleSelectGroup(activity.id)}
                  >
                    <span className={styles.groupItemTitle}>{activity.title}</span>
                    <span className={styles.groupItemPreview}>
                      {preview.senderName && <span className={styles.groupItemPreviewSender}>{preview.senderName}: </span>}
                      {preview.text}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          <div className={styles.conversation}>
            {activeActivity ? (
              <>
                <div className={styles.conversationHeader}>
                  <button
                    type="button"
                    className={styles.backBtn}
                    onClick={() => setView('list')}
                    aria-label="Quay lại danh sách nhóm"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <span className={styles.conversationHeaderTitle}>{activeActivity.title}</span>
                </div>
                <ul className={styles.messageList}>
                  {messages.length === 0 ? (
                    <li className={styles.empty}>Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện.</li>
                  ) : (
                    messages.map((m) => {
                      const author = getUserById(m.authorId);
                      const isSelf = m.authorId === currentUser.id;
                      return (
                        <li key={m.id} className={`${styles.messageRow} ${isSelf ? styles.messageRowSelf : ''}`}>
                          <div className={styles.avatar}>{author?.avatarInitials ?? '?'}</div>
                          <div className={styles.bubbleCol}>
                            <div className={styles.meta}>
                              <span className={styles.author}>{author?.name ?? 'Người dùng ẩn danh'}</span>
                              <span className={styles.time}>{formatTime(m.createdAt)}</span>
                            </div>
                            <div className={`${styles.bubble} ${isSelf ? styles.bubbleSelf : ''}`}>{m.content}</div>
                          </div>
                        </li>
                      );
                    })
                  )}
                </ul>

                <div className={styles.composer}>
                  <button
                    type="button"
                    className={styles.imageBtn}
                    title="Gửi hình ảnh (chưa hỗ trợ trong bản demo)"
                    aria-label="Gửi hình ảnh"
                  >
                    <Image size={18} />
                  </button>
                  <input
                    className={styles.input}
                    placeholder="Nhập tin nhắn..."
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') submit();
                    }}
                  />
                  <button
                    type="button"
                    className={styles.sendBtn}
                    onClick={submit}
                    disabled={!draft.trim()}
                    aria-label="Gửi tin nhắn"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </>
            ) : (
              <p className={styles.emptyGroups}>Chọn một nhóm để xem cuộc trò chuyện.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
