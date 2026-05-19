import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchReadingHistory } from '../services/api';

export default function ReadingListPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['history'],
    queryFn: fetchReadingHistory,
  });

  return (
    <main className='page fadeIn'>
      <h1 className='title'>상담 기록</h1>
      {isLoading ? (
        <p>기록을 불러오는 중입니다.</p>
      ) : (
        <div className='readingGrid'>
          {data.map((item) => (
            <Link key={item.id} to={`/readings/${item.id}`} className='cardGlass readingCard'>
              <h2>{item.title}</h2>
              <p>{item.summary}</p>
              <small>{item.date}</small>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
