import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../store/authStore';
import { fetchReadingHistory } from '../services/api';

export default function MyPage() {
  const user = useAuthStore((state) => state.user);
  const { data: readings = [] } = useQuery({
    queryKey: ['history'],
    queryFn: fetchReadingHistory,
  });

  const latest = readings[0];

  return (
    <main className='page fadeIn'>
      <section className='mypageGrid'>
        <article className='cardGlass profilePanel'>
          <p className='eyebrow'>Profile</p>
          <h1 className='title'>마이페이지</h1>
          <dl>
            <div>
              <dt>이름</dt>
              <dd>{user?.name || 'Mystic User'}</dd>
            </div>
            <div>
              <dt>이메일</dt>
              <dd>{user?.email || 'demo@example.com'}</dd>
            </div>
          </dl>
        </article>

        <article className='cardGlass statPanel'>
          <span>총 상담</span>
          <strong>{readings.length}</strong>
          <p>mock API 기준 최근 상담 기록입니다.</p>
        </article>

        <article className='cardGlass latestPanel'>
          <h2>최근 상담</h2>
          {latest ? (
            <>
              <strong>{latest.title}</strong>
              <p>{latest.mood}</p>
              <small>{latest.date}</small>
            </>
          ) : (
            <p>아직 상담 기록이 없습니다.</p>
          )}
        </article>
      </section>

      <section className='quickActions'>
        <Link className='primaryAction' to='/tarot'>새 상담 시작</Link>
        <Link className='secondaryAction' to='/readings'>상담 기록 보기</Link>
      </section>
    </main>
  );
}
