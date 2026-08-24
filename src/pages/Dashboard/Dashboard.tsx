import { Link } from 'react-router-dom';
import { CalendarDays, Award, MessagesSquare, Target, Wallet, ShieldCheck, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { getFundEntry } from '../../mock-data/funds';
import { Card } from '../../components/Card/Card';
import { ActivityTypeTag } from '../../components/ActivityTypeTag/ActivityTypeTag';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import styles from './Dashboard.module.css';

function formatCurrency(n: number) {
  return n.toLocaleString('vi-VN') + ' đ';
}

export function Dashboard() {
  const { currentUser, activeSubAssociationId } = useAuth();
  const { activities, posts, goals, subAssociations } = useAppData();
  if (!currentUser) return null;

  if (currentUser.role === 'admin') {
    return (
      <div>
        <h1>Tổng quan hệ thống</h1>
        <p className={styles.pageDescription}>Danh sách các chi hội đang hoạt động trên hệ thống.</p>
        <div className={styles.cardGrid}>
          {subAssociations.map((sa) => {
            const saActivities = activities.filter((a) => a.subAssociationId === sa.id);
            return (
              <Card key={sa.id}>
                <div className={styles.statCardHeader}>
                  <Building2 size={20} color="var(--color-primary)" />
                  <h3 className={styles.statCardTitle}>{sa.name}</h3>
                </div>
                <p className={styles.statLine}>{saActivities.length} hoạt động đã tổ chức</p>
                <p className={styles.statLine}>Nhiệm kỳ: {sa.termOfOffice}</p>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  const myActivities = activities.filter((a) => a.subAssociationId === activeSubAssociationId);
  const participatedActivities = myActivities.filter((a) => a.participantIds.includes(currentUser.id));
  const myPosts = posts.filter((p) => p.postType === 'forum' && p.authorId === currentUser.id);
  const recentPosts = posts
    .filter((p) => p.postType === 'forum' && p.subAssociationId === activeSubAssociationId)
    .slice(0, 3);

  if (currentUser.role === 'bch') {
    const myGoals = goals.filter((g) => g.subAssociationId === activeSubAssociationId);
    const totalGoalActivities = myGoals.reduce((sum, g) => sum + g.activityIds.length, 0);
    const fund = activeSubAssociationId ? getFundEntry(activeSubAssociationId) : undefined;
    const spent = fund ? fund.expenses.reduce((sum, e) => sum + e.amount, 0) : 0;
    const remaining = fund ? fund.startingBalance - spent : 0;
    const pendingModeration = posts.filter(
      (p) => p.postType === 'forum' && p.subAssociationId === activeSubAssociationId && p.status === 'hidden',
    ).length;
    const newFeedback = posts.filter(
      (p) => p.postType === 'feedback' && p.subAssociationId === activeSubAssociationId && p.status === 'new',
    ).length;

    return (
      <div>
        <h1>Chào, {currentUser.name}</h1>
        <p className={styles.pageDescription}>Tổng quan công tác Ban Chấp Hành nhiệm kỳ hiện tại.</p>

        <div className={styles.cardGrid}>
          <Card>
            <div className={styles.statCardHeader}>
              <Target size={20} color="var(--color-primary)" />
              <h3 className={styles.statCardTitle}>Chỉ tiêu hoạt động</h3>
            </div>
            <p className={styles.statLine}>
              <strong>{myGoals.length}</strong> chỉ tiêu · <strong>{totalGoalActivities}</strong> hoạt động đã gán
            </p>
            <Link to="/quota" className={styles.cardLink}>
              Xem chi tiết →
            </Link>
          </Card>

          <Card>
            <div className={styles.statCardHeader}>
              <Wallet size={20} color="var(--color-primary)" />
              <h3 className={styles.statCardTitle}>Quỹ chi hội</h3>
            </div>
            <p className={styles.statLine}>Còn lại: <strong>{formatCurrency(remaining)}</strong></p>
            <p className={styles.statLineMuted}>Đã chi: {formatCurrency(spent)}</p>
            <Link to="/funds" className={styles.cardLink}>
              Xem chi tiết →
            </Link>
          </Card>

          <Card>
            <div className={styles.statCardHeader}>
              <ShieldCheck size={20} color="var(--color-primary)" />
              <h3 className={styles.statCardTitle}>Kiểm duyệt diễn đàn</h3>
            </div>
            <p className={styles.statLine}>
              <strong>{pendingModeration}</strong> bài viết đang bị ẩn
            </p>
            <Link to="/forum/moderation" className={styles.cardLink}>
              Đi tới kiểm duyệt →
            </Link>
          </Card>

          <Card>
            <div className={styles.statCardHeader}>
              <MessagesSquare size={20} color="var(--color-primary)" />
              <h3 className={styles.statCardTitle}>Góp ý mới</h3>
            </div>
            <p className={styles.statLine}>
              <strong>{newFeedback}</strong> góp ý chưa xem xét
            </p>
            <Link to="/feedback" className={styles.cardLink}>
              Xem góp ý →
            </Link>
          </Card>
        </div>

        <h2 className={styles.sectionTitle}>Hoạt động gần đây</h2>
        {myActivities.length === 0 ? (
          <EmptyState title="Chưa có hoạt động nào" />
        ) : (
          <div className={styles.activityList}>
            {myActivities.slice(0, 4).map((a) => (
              <Card key={a.id} className={styles.activityRow}>
                <div>
                  <Link to={`/activities/${a.id}`} className={styles.activityTitle}>
                    {a.title}
                  </Link>
                  <p className={styles.statLineMuted}>{new Date(a.date).toLocaleDateString('vi-VN')} · {a.location}</p>
                </div>
                <ActivityTypeTag type={a.type} />
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1>Chào, {currentUser.name}</h1>
      <p className={styles.pageDescription}>Đây là tổng quan hoạt động và thông tin cá nhân của bạn.</p>

      <div className={styles.cardGrid}>
        <Card>
          <div className={styles.statCardHeader}>
            <CalendarDays size={20} color="var(--color-primary)" />
            <h3 className={styles.statCardTitle}>Hoạt động đã tham gia</h3>
          </div>
          <p className={styles.statLine}>
            <strong>{participatedActivities.length}</strong> hoạt động
          </p>
          <Link to="/activities" className={styles.cardLink}>
            Xem tất cả hoạt động →
          </Link>
        </Card>

        <Card>
          <div className={styles.statCardHeader}>
            <Award size={20} color="var(--color-primary)" />
            <h3 className={styles.statCardTitle}>Huy hiệu đạt được</h3>
          </div>
          <p className={styles.statLine}>
            <strong>{currentUser.badgeIds.length}</strong> huy hiệu
          </p>
          <Link to="/profile" className={styles.cardLink}>
            Xem hồ sơ →
          </Link>
        </Card>

        <Card>
          <div className={styles.statCardHeader}>
            <MessagesSquare size={20} color="var(--color-primary)" />
            <h3 className={styles.statCardTitle}>Bài viết của tôi</h3>
          </div>
          <p className={styles.statLine}>
            <strong>{myPosts.length}</strong> bài viết trên diễn đàn
          </p>
          <Link to="/forum" className={styles.cardLink}>
            Đi tới diễn đàn →
          </Link>
        </Card>
      </div>

      <h2 className={styles.sectionTitle}>Bài viết gần đây trong chi hội</h2>
      {recentPosts.length === 0 ? (
        <EmptyState title="Chưa có bài viết nào" />
      ) : (
        <div className={styles.activityList}>
          {recentPosts.map((p) => (
            <Card key={p.id} className={styles.activityRow}>
              <div>
                <Link to={`/forum/${p.id}`} className={styles.activityTitle}>
                  {p.title}
                </Link>
                <p className={styles.statLineMuted}>{p.topic} · {p.comments.length} bình luận</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
