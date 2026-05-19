import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function HomePage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <main className='homePage fadeIn'>
      <section className='homeHero'>
        <div className='heroCopy'>
          <p className='eyebrow'>Korea Tarot Reading</p>
          <h1 className='title'>Mystic Arcana</h1>
          <p className='heroLead'>
            고민을 정리하고, 세 장의 카드로 지금 필요한 흐름과 조언을 확인하세요.
          </p>
          <div className='heroActions'>
            {isAuthenticated ? (
              <Link className='primaryAction' to='/tarot'>상담 시작</Link>
            ) : (
              <>
                <Link className='primaryAction' to='/login'>로그인</Link>
                <Link className='secondaryAction' to='/signup'>회원가입</Link>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
