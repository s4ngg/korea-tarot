import { useParams } from 'react-router-dom';

export default function ReadingDetailPage() {
  const { id } = useParams();

  return (
    <main className='page fadeIn'>
      <article className='cardGlass resultCard'>
        <h1 className='title'>상담 상세 #{id}</h1>
        <p>별빛 아래 당신의 선택은 새로운 흐름을 향하고 있습니다.</p>
      </article>
    </main>
  );
}
