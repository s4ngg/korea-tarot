import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Starfield from '../components/common/Starfield/Starfield';
import styles from './TarotResultPage.module.css';

const POSITIONS = ['과거', '현재', '미래'];

function TarotResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const reading = location.state?.reading;

  useEffect(() => {
    if (!reading) navigate('/tarot', { replace: true });
  }, [reading, navigate]);

  if (!reading) return null;

  const cards = [...(reading.cards || [])].sort((a, b) => a.cardOrder - b.cardOrder);

  return (
    <div className={styles.page}>
      <Starfield />

      <main className={styles.main}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>타로 해석 결과</h1>
          <div className={styles.divider} />
        </header>

        <section className={styles.cardsSection}>
          {cards.map((card, idx) => (
            <div
              key={card.cardId ?? idx}
              className={`${styles.cardItem} ${idx === 1 ? styles.cardItemCenter : ''}`}
              style={{ animationDelay: `${(idx + 1) * 0.2}s` }}
            >
              <div className={`${styles.cardVisual} ${idx === 1 ? styles.cardVisualCenter : ''}`}>
                <div className={styles.cardBack}>
                  <span className={styles.cardBackIcon}>✦</span>
                </div>
                <div className={styles.cardLabel}>
                  <span className={styles.cardPosition}>{POSITIONS[idx]}</span>
                </div>
                {idx === 1 && <div className={styles.cardGlow} />}
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
                <span>✦</span>
                운명의 속삭임
                <span>✦</span>
              </h2>
              <div className={styles.interpretText}>
                {reading.interpretation}
              </div>
            </div>
          </div>
          <div className={styles.scrollBottom} />
        </section>

        <section className={styles.actions}>
          <Link to="/mypage/readings" className={styles.primaryBtn}>
            📖 기록 보러가기
          </Link>
          <button
            className={styles.secondaryBtn}
            onClick={() => navigate('/tarot')}
          >
            ↺ 다시 상담하기
          </button>
        </section>
      </main>
    </div>
  );
}

export default TarotResultPage;
