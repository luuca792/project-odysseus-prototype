import { Link, useLocation } from 'react-router-dom';
import { Button } from '../../components/Button';
import styles from './NotFound.module.css';

export function NotFound() {
  const location = useLocation();
  const is403 = location.pathname === '/403';

  return (
    <div className={styles.wrap}>
      <h1 className={styles.code}>{is403 ? '403' : '404'}</h1>
      <p className={styles.message}>
        {is403 ? 'Bạn không có quyền truy cập trang này.' : 'Không tìm thấy trang bạn yêu cầu.'}
      </p>
      <Link to="/">
        <Button>Về trang chủ</Button>
      </Link>
    </div>
  );
}
