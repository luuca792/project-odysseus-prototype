import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { getUserRoleLabel } from '../../mock-data/roleLabels';
import logoUrl from '../../assets/images/CTU_logo.png';
import styles from './Login.module.css';

export function Login() {
  const { demoAccounts, login } = useAuth();
  const { subAssociations } = useAppData();
  const navigate = useNavigate();

  function handleSelect(userId: string) {
    login(userId);
    navigate('/');
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <img src={logoUrl} alt="Logo Đại học Cần Thơ" className={styles.logo} />
          <h1 className={styles.title}>Hệ thống Quản lý Công tác Hội</h1>
          <p className={styles.subtitle}>Bản dựng thử (prototype) — Đại học Cần Thơ</p>
        </div>

        <p className={styles.instruction}>Chọn một tài khoản demo để đăng nhập (không cần mật khẩu):</p>

        <ul className={styles.accountList}>
          {demoAccounts.map((account) => {
            const subNames = subAssociations
              .filter((s) => account.subAssociationIds.includes(s.id))
              .map((s) => s.name)
              .join(', ');
            return (
              <li key={account.id}>
                <button className={styles.accountBtn} onClick={() => handleSelect(account.id)}>
                  <span className={styles.avatar}>{account.avatarInitials}</span>
                  <span className={styles.info}>
                    <span className={styles.name}>{account.name}</span>
                    <span className={styles.meta}>
                      {getUserRoleLabel(account)}
                      {subNames ? ` · ${subNames}` : ''}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <p className={styles.footnote}>
          Đây là bản dựng thử để đánh giá giao diện — không có xác thực thật, dữ liệu chỉ tồn tại trong phiên làm việc hiện tại.
        </p>
      </div>
    </div>
  );
}
