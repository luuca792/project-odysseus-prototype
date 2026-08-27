import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useNotifications } from '../../context/NotificationContext';
import { getUserRoleLabel } from '../../mock-data/roleLabels';
import { getNavSections, isNavGroup, isNavDivider, type NavItem, type NavGroup } from './navConfig';
import { NotificationDot } from '../NotificationDot/NotificationDot';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import logoUrl from '../../assets/images/CTU_logo.png';
import styles from './AppShell.module.css';

// Dividers are only ever used top-level (see the navSections.map below) and never
// appear inside a NavGroup's items, so NavEntryView only needs to handle the two
// renderable entry kinds.
function NavEntryView({ entry, depth, onNavigate }: { entry: NavItem | NavGroup; depth: number; onNavigate: () => void }) {
  const { hasUnreadActivities, hasUnreadForumPosts } = useNotifications();

  if (isNavGroup(entry)) {
    return (
      <div className={styles.navGroup}>
        <span className={styles.navGroupLabel} style={{ paddingLeft: 12 + depth * 12 }}>
          {entry.label}
        </span>
        {entry.items.map((child) => (
          <NavEntryView key={isNavGroup(child) ? child.label : child.to} entry={child} depth={depth} onNavigate={onNavigate} />
        ))}
      </div>
    );
  }

  const Icon = entry.icon;
  const showDot =
    (entry.notificationKey === 'activities' && hasUnreadActivities) ||
    (entry.notificationKey === 'forum' && hasUnreadForumPosts);

  return (
    <NavLink
      to={entry.to}
      end={entry.to === '/'}
      className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
      style={{ paddingLeft: 12 + depth * 12 }}
      onClick={onNavigate}
    >
      <Icon size={18} />
      <span>{entry.label}</span>
      {showDot && <NotificationDot className={styles.navDot} />}
    </NavLink>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentUser, activeSubAssociationId, logout } = useAuth();
  const { subAssociations, rolePermissions } = useAppData();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  if (!currentUser) return <>{children}</>;

  const subAssociation = subAssociations.find((s) => s.id === activeSubAssociationId);
  const navSections = getNavSections(currentUser.role, rolePermissions[currentUser.role] ?? []);
  const canViewProfile = currentUser.role === 'member' || currentUser.role === 'bch';

  function closeMobileNav() {
    setMobileNavOpen(false);
  }

  function handleSwitchAccount() {
    setAccountMenuOpen(false);
    logout();
    navigate('/login');
  }

  function handleGoToProfile() {
    setAccountMenuOpen(false);
    navigate('/profile');
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            className={styles.menuToggle}
            onClick={() => setMobileNavOpen((v) => !v)}
            aria-label="Mở menu điều hướng"
          >
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <img src={logoUrl} alt="Logo Đại học Cần Thơ" className={styles.logo} />
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>
              <span className={styles.brandTitleFull}>{subAssociation?.name ?? 'Hệ thống Quản lý Công tác Hội'}</span>
              <span className={styles.brandTitleShort}>{subAssociation?.shortName ?? 'Hệ thống Quản lý Công tác Hội'}</span>
            </span>
            <span className={styles.brandSub}>{subAssociation?.slogan ?? 'Đại học Cần Thơ'}</span>
          </div>
        </div>

        <div className={styles.headerRight}>
          <ThemeToggle />
          <div className={styles.accountBtnWrap}>
            <button className={styles.accountBtn} onClick={() => setAccountMenuOpen((v) => !v)}>
              <span className={styles.avatar}>{currentUser.avatarInitials}</span>
              <span className={styles.accountText}>
                <span className={styles.accountName}>{currentUser.name}</span>
                <span className={styles.accountRole}>{getUserRoleLabel(currentUser)}</span>
              </span>
              <ChevronDown size={16} />
            </button>
            {accountMenuOpen && (
              <div className={styles.accountMenu}>
                {canViewProfile && (
                  <button className={styles.accountMenuItem} onClick={handleGoToProfile}>
                    <User size={16} /> Hồ sơ cá nhân
                  </button>
                )}
                <button className={styles.accountMenuItem} onClick={handleSwitchAccount}>
                  <LogOut size={16} /> Đổi tài khoản
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className={styles.body}>
        <nav className={`${styles.sidebar} ${mobileNavOpen ? styles.sidebarOpen : ''}`}>
          {navSections.map((entry, index) => {
            if (isNavDivider(entry)) {
              return <div key={`divider-${index}`} className={styles.navDivider} />;
            }
            return (
              <div key={isNavGroup(entry) ? entry.label : entry.to}>
                {isNavGroup(entry) && <div className={styles.navDivider} />}
                <NavEntryView entry={entry} depth={0} onNavigate={closeMobileNav} />
              </div>
            );
          })}
        </nav>

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
