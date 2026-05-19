import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReadings, deleteReading } from '../api/readingApi';
import Starfield from '../components/common/Starfield/Starfield';
import styles from './ReadingListPage.module.css';

function ReadingListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: readingsRes, isLoading } = useQuery({
    queryKey: ['readings'],
    queryFn: getReadings,
  });

  const readings = readingsRes?.data?.data || [];

  const deleteMutation = useMutation({
    mutationFn: deleteReading,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readings'] });
    },
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getFullYear()}년 ${String(d.getMonth() + 1).padStart(2, '0')}월 ${String(d.getDate()).padStart(2, '0')}일`;
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('이 상담 기록을 삭제하시겠습니까?')) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className={styles.page}>
      <Starfield />

      <main className={styles.main}>
        <div className={styles.topBar}>
          <button className={styles.backBtn} onClick={() => navigate('/mypage')}>
            ← 마이페이지
          </button>
          <h1 className={styles.pageTitle}>상담 기록 전체</h1>
        </div>

        {isLoading ? (
          <div className={styles.loading}>기록을 불러오는 중...</div>
        ) : readings.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyText}>아직 상담 기록이 없습니다.</p>
            <Link to="/tarot" className={styles.startBtn}>첫 상담 시작하기</Link>
          </div>
        ) : (
          <div className={styles.list}>
            {readings.map((reading) => {
              const sortedCards = [...(reading.cards || [])].sort((a, b) => a.cardOrder - b.cardOrder);
              return (
                <div key={reading.id} className={styles.readingCard}>
                  <div className={styles.leftBar} />
                  <div className={styles.cardContent}>
                    <div className={styles.cardLeft}>
                      <span className={styles.date}>{formatDate(reading.createdAt)}</span>
                      <h3 className={styles.concern}>{reading.concernText}</h3>
                      <div className={styles.cardMinis}>
                        {sortedCards.map((card, i) => (
                          <div key={i} className={styles.cardMini} title={card.nameKr || card.name}>
                            <span className={styles.cardMiniIcon}>✦</span>
                            {card.nameKr && <span className={styles.cardMiniName}>{card.nameKr}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={styles.cardRight}>
                      <Link to={`/mypage/readings/${reading.id}`} className={styles.detailBtn}>
                        자세히 보기
                      </Link>
                      <button
                        className={styles.deleteBtn}
                        onClick={(e) => handleDelete(e, reading.id)}
                        disabled={deleteMutation.isPending}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default ReadingListPage;
