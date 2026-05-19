import { useParams } from 'react-router-dom';
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
      <article className='cardGlass resultCard'>
        <h1 className='title'>{data.title}</h1>
        <p>{data.interpretation}</p>
        <section className='adviceBox'>
          <h2>조언</h2>
          <p>{data.advice}</p>
        </section>
      </article>
    </main>
  );
}
