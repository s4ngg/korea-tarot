import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchReadingResult } from '../services/api';

export default function TarotResultPage() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['reading', id || 'latest'],
    queryFn: () => fetchReadingResult(id),
  });

  if (isLoading) {
    return <main className='page'>결과를 불러오는 중입니다.</main>;
  }

  return (
    <main className='page fadeIn'>
      <article className='readingResult'>
        <header className='resultHero'>
          <p className='eyebrow'>Reading result</p>
          <h1 className='title'>{data.title}</h1>
          <p>{data.interpretation}</p>
        </header>

        <section className='resultCards' aria-label='선택한 카드'>
          {data.cards.map((card) => (
            <div key={card.id} className='miniTarotCard'>
              <span>{card.roman}</span>
              <strong>{card.name}</strong>
              <small>{card.english}</small>
              <em>{card.keyword}</em>
            </div>
          ))}
        </section>

        <section className='resultSections'>
          {data.sections.map((section) => (
            <div key={section.title} className='cardGlass resultSection'>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </div>
          ))}
        </section>

        <section className='adviceBox'>
          <h2>오늘의 조언</h2>
          <p>{data.advice}</p>
        </section>

        <div className='pageActions'>
          <Link className='secondaryAction' to='/tarot'>다시 선택</Link>
          <Link className='primaryAction' to='/readings'>상담 기록 보기</Link>
        </div>
      </article>
    </main>
  );
}
