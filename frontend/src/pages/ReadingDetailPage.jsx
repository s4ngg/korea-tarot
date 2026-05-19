import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReadingDetail, deleteReading } from '../api/readingApi';
import Starfield from '../components/common/Starfield/Starfield';
import styles from './ReadingDetailPage.module.css';

const POSITIONS = ['과거', '현재', '미래'];

function ReadingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: res, isLoading, isError } = useQuery({
    queryKey: ['reading', id],
    queryFn: () => getReadingDetail(id),
  });

  const reading = res?.data?.data;

  const deleteMutation = useMutation({
    mutationFn: () => deleteReading(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readings'] });
      navigate('/mypage/readings');
    },
  });

  const handleDelete = () => {
    if (!window.confirm('이 상담 기록을 삭제하시겠습니까?')) return;
    deleteMutation.mutate();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getFullYear()}년 ${String(d.getMonth() + 1).padStart(2, '0')}월 ${String(d.getDate()).padStart(2, '0')}일`;
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Starfield />
        <div className={styles.loading}>기록을 불러오는 중...</div>
      </div>
    );
  }

  if (isError || !reading) {
    return (
      <div className={styles.page}>
        <Starfield />
        <div className={styles.loading}>기록을 불러올 수 없습니다.</div>
      </div>
    );
  }

  const sortedCards = [...(reading.cards || [])].sort((a, b) => a.cardOrder - b.cardOrder);

  return (
    <div className={styles.page}>
      <Starfield />

      <main className={styles.main}>
        <div className={styles.topBar}>
          <button className={styles.backBtn} onClick={() => navigate('/mypage/readings')}>
            ← 목록으로
          </button>
          <span className={styles.dateLabel}>{formatDate(reading.createdAt)}</span>
        </div>

        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>타로 해석 결과</h1>
          <p className={styles.concernText}>"{reading.concernText}"</p>
          <div className={styles.divider} />
        </header>

        <section className={styles.cardsSection}>
          {sortedCards.map((card, idx) => (
            <div
              key={card.cardId ?? idx}
              className={`${styles.cardItem} ${idx === 1 ? styles.cardItemCenter : ''}`}
              style={{ animationDelay: `${(idx + 1) * 0.15}s` }}
            >
              <div className={`${styles.cardVisual} ${idx === 1 ? styles.cardVisualCenter : ''}`}>
                <div className={styles.cardBack}>
                  <span className={styles.cardBackIcon}>✦</span>
                </div>
                <div className={styles.cardLabel}>
                  <span className={styles.cardPosition}>{POSITIONS[idx] || `카드 ${idx + 1}`}</span>
                </div>
              </div>
              <h3 className={`${styles.cardName} ${idx === 1 ? styles.cardNameCenter : ''}`}>
                {POSITIONS[idx]}: {card.nameKr || card.name}
              </h3>
            </div>
          ))}
        </section>

        <section className={styles.interpretSection}>
          <div className={styles.scrollTop} />
          <div className={styles.scrollBody}>
            <div className={styles.scrollBgIcon}>✦</div>
            <div className={styles.scrollContent}>
              <h2 className={styles.scrollTitle}>
                <span>✦</span> 운명의 속삭임 <span>✦</span>
              </h2>
              <div className={styles.interpretText}>
                {reading.interpretation}
              </div>
            </div>
          </div>
          <div className={styles.scrollBottom} />
        </section>

        <section className={styles.actions}>
          <button className={styles.newBtn} onClick={() => navigate('/tarot')}>
            ↺ 새 상담하기
          </button>
          <button
            className={styles.deleteBtn}
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            🗑 기록 삭제
          </button>
        </section>
      </main>
    </div>
  );
}

export default ReadingDetailPage;
