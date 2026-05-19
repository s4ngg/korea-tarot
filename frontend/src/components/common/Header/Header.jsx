import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../../stores/authStore';
import { logout } from '../../../api/authApi';
import styles from './Header.module.css';

function Header() {
  const { isAuthenticated, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearAuth();
      navigate('/');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          Korea Tarot
        </Link>
        <nav className={styles.nav}>
          {isAuthenticated ? (
            <>
              <Link to="/tarot" className={styles.navLink}>
                상담하기
              </Link>
              <Link to="/mypage" className={styles.navLink}>
                마이페이지
              </Link>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navLink}>
                로그인
              </Link>
              <Link to="/signup" className={styles.navLink}>
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
