import { Link, useParams } from 'react-router-dom';

export default function ReadingDetailPage() {
  const { id } = useParams();

  return (
    <main className='page fadeIn'>
      <article className='readingResult'>
        <p className='eyebrow'>Archived reading</p>
        <h1 className='title'>상담 상세 #{id}</h1>
        <p>
          이 기록은 mock 데이터로 표시됩니다. 실제 API가 연결되면 선택 카드,
          질문, AI 해석 결과가 이 영역에 채워집니다.
        </p>
        <div className='pageActions'>
          <Link className='secondaryAction' to='/readings'>목록으로</Link>
          <Link className='primaryAction' to='/tarot'>새 상담 시작</Link>
        </div>
      </article>
    </main>
  );
}
