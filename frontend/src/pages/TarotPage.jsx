import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getCards, createReading } from '../api/tarotApi';
import Starfield from '../components/common/Starfield/Starfield';
import styles from './TarotPage.module.css';

const MAX_CARDS = 3;

function TarotPage() {
  const navigate = useNavigate();
  const [concern, setConcern] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const { data: cardsRes, isLoading } = useQuery({
    queryKey: ['tarot-cards'],
    queryFn: getCards,
  });

  const cards = cardsRes?.data?.data || [];

  const readingMutation = useMutation({
    mutationFn: createReading,
    onSuccess: (res) => {
      navigate('/tarot/result', { state: { reading: res.data.data } });
    },
  });

  const toggleCard = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(v => v !== id);
      if (prev.length >= MAX_CARDS) return prev;
      return [...prev, id];
    });
  };

  const canSubmit = selectedIds.length === MAX_CARDS && concern.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    readingMutation.mutate({ concernText: concern, cardIds: selectedIds });
  };

  return (
    <div className={styles.page}>
      <Starfield />

      <main className={styles.main}>
        <section className={styles.concernSection}>
          <h1 className={styles.pageTitle}>당신의 운명을 물어보세요</h1>
          <div className={styles.textareaWrap}>
            <textarea
              className={styles.textarea}
              placeholder="고민을 입력하세요..."
              value={concern}
              onChange={e => setConcern(e.target.value.slice(0, 500))}
              maxLength={500}
            />
            <span className={styles.charCount}>{concern.length}/500</span>
          </div>
          <p className={styles.concernHint}>
            진실된 마음으로 질문을 입력할수록 카드는 더 명확한 답을 줍니다.
          </p>
        </section>

        <section className={styles.gridSection}>
          <div className={styles.gridHeader}>
            <div>
              <h2 className={styles.gridTitle}>운명의 카드 선택</h2>
              <p className={styles.gridSubtitle}>신중하게 3장의 카드를 선택해 주세요.</p>
            </div>
            <div className={styles.selectedCount}>
              <span className={selectedIds.length === MAX_CARDS ? styles.countFull : styles.count}>
                {selectedIds.length}
              </span>
              <span className={styles.countDivider}> / {MAX_CARDS}</span>
            </div>
          </div>

          {isLoading ? (
            <div className={styles.loading}>카드를 불러오는 중...</div>
          ) : (
            <div className={styles.grid}>
              {cards.map((card) => {
                const isSelected = selectedIds.includes(card.id);
                const isDisabled = !isSelected && selectedIds.length >= MAX_CARDS;
                return (
                  <button
                    key={card.id}
                    className={`${styles.card} ${isSelected ? styles.cardSelected : ''} ${isDisabled ? styles.cardDisabled : ''}`}
                    onClick={() => toggleCard(card.id)}
                    disabled={isDisabled}
                    title={card.nameKr || card.name}
                    type="button"
                  >
                    <div className={styles.cardInner}>
                      <span className={styles.cardStar}>✦</span>
                    </div>
                    {isSelected && <div className={styles.cardShimmer} />}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className={styles.ctaSection}>
          <button
            className={`${styles.submitBtn} ${canSubmit ? styles.submitBtnActive : ''}`}
            disabled={!canSubmit || readingMutation.isPending}
            onClick={handleSubmit}
          >
            {readingMutation.isPending ? '영적 에너지를 모으는 중...' : '해석 받기'}
          </button>
          {readingMutation.isError && (
            <p className={styles.error}>
              {readingMutation.error?.response?.data?.message || '오류가 발생했습니다. 다시 시도해 주세요.'}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

export default TarotPage;
