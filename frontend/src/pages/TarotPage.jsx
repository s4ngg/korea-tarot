import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TarotPage.module.css';

const cards = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  name: `Arcana ${index + 1}`,
}));

export default function TarotPage() {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const toggle = (id) => {
    setSelected((previous) => {
      if (previous.includes(id)) {
        return previous.filter((value) => value !== id);
      }

      return previous.length < 3 ? [...previous, id] : previous;
    });
  };

  return (
    <main className='page fadeIn'>
      <h1 className='title'>카드를 선택하세요</h1>
      <p className='pageLead'>당신의 직감을 따라 3장의 카드를 선택해보세요.</p>
      <div className={styles.grid}>
        {cards.map((card) => (
          <button
            key={card.id}
            type='button'
            onClick={() => toggle(card.id)}
            className={`${styles.card} ${selected.includes(card.id) ? styles.selected : ''}`}
            aria-pressed={selected.includes(card.id)}
            aria-label={`${card.name} 선택`}
          >
            <span className={styles.inner}>✦</span>
          </button>
        ))}
      </div>
      <button
        type='button'
        disabled={selected.length !== 3}
        className={styles.button}
        onClick={() => navigate('/tarot/result/1')}
      >
        결과 보기
      </button>
    </main>
  );
}
