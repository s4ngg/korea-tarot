import { Outlet, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Layout() {
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <>
      <div className='starfield' />
      <header className='siteHeader'>
        <Link to='/' className='brand title'>Mystic Arcana</Link>
        <nav className='siteNav' aria-label='주요 메뉴'>
          {isAuthenticated ? (
            <>
              <Link to='/tarot'>타로 상담</Link>
              <Link to='/mypage'>마이페이지</Link>
              <Link to='/readings'>상담 기록</Link>
              <button type='button' className='linkButton' onClick={logout}>로그아웃</button>
            </>
          ) : (
            <>
              <Link to='/login'>로그인</Link>
              <Link to='/signup'>회원가입</Link>
            </>
          )}
        </nav>
      </header>
      <Outlet />
    </>
  );
}
