import useAuthStore from '../store/authStore';

export default function MyPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <main className='page fadeIn'>
      <section className='cardGlass resultCard'>
        <h1 className='title'>마이페이지</h1>
        <p>이름: {user?.name || 'Mystic User'}</p>
        <p>이메일: {user?.email || 'demo@example.com'}</p>
      </section>
    </main>
  );
}
