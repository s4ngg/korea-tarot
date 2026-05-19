import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TarotPage.module.css';

const tarotCards = [
  { id: 0, roman: '0', name: '바보', english: 'The Fool', keyword: '시작' },
  { id: 1, roman: 'I', name: '마법사', english: 'The Magician', keyword: '의지' },
  { id: 2, roman: 'II', name: '여사제', english: 'The High Priestess', keyword: '직감' },
  { id: 3, roman: 'III', name: '여황제', english: 'The Empress', keyword: '풍요' },
  { id: 4, roman: 'IV', name: '황제', english: 'The Emperor', keyword: '질서' },
  { id: 5, roman: 'V', name: '교황', english: 'The Hierophant', keyword: '신뢰' },
  { id: 6, roman: 'VI', name: '연인', english: 'The Lovers', keyword: '선택' },
  { id: 7, roman: 'VII', name: '전차', english: 'The Chariot', keyword: '전진' },
  { id: 8, roman: 'VIII', name: '힘', english: 'Strength', keyword: '용기' },
  { id: 9, roman: 'IX', name: '은둔자', english: 'The Hermit', keyword: '성찰' },
  { id: 10, roman: 'X', name: '운명의 수레바퀴', english: 'Wheel of Fortune', keyword: '전환' },
  { id: 11, roman: 'XI', name: '정의', english: 'Justice', keyword: '균형' },
  { id: 12, roman: 'XII', name: '매달린 사람', english: 'The Hanged Man', keyword: '관점' },
  { id: 13, roman: 'XIII', name: '죽음', english: 'Death', keyword: '변화' },
  { id: 14, roman: 'XIV', name: '절제', english: 'Temperance', keyword: '조율' },
  { id: 15, roman: 'XV', name: '악마', english: 'The Devil', keyword: '집착' },
  { id: 16, roman: 'XVI', name: '탑', english: 'The Tower', keyword: '해방' },
  { id: 17, roman: 'XVII', name: '별', english: 'The Star', keyword: '희망' },
  { id: 18, roman: 'XVIII', name: '달', english: 'The Moon', keyword: '불안' },
  { id: 19, roman: 'XIX', name: '태양', english: 'The Sun', keyword: '활력' },
  { id: 20, roman: 'XX', name: '심판', english: 'Judgement', keyword: '각성' },
  { id: 21, roman: 'XXI', name: '세계', english: 'The World', keyword: '완성' },
];

export default function TarotPage() {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const selectedCards = useMemo(
    () => selected.map((id) => tarotCards.find((card) => card.id === id)).filter(Boolean),
    [selected],
  );

  const toggle = (id) => {
    setSelected((previous) => {
      if (previous.includes(id)) {
        return previous.filter((value) => value !== id);
      }

      return previous.length < 3 ? [...previous, id] : previous;
    });
  };

  const submit = () => {
    localStorage.setItem('selectedTarotCards', JSON.stringify(selectedCards));
    navigate('/tarot/result/1');
  };

  return (
    <main className='page fadeIn'>
      <section className={styles.heading}>
        <div>
          <p className='eyebrow'>Three card spread</p>
          <h1 className='title'>카드를 선택하세요</h1>
          <p className='pageLead'>현재의 고민을 떠올리며 3장의 카드를 고르세요.</p>
        </div>
        <div className={styles.counter}>{selected.length}/3</div>
      </section>

      <div className={styles.grid}>
        {tarotCards.map((card) => {
          const isSelected = selected.includes(card.id);

          return (
            <button
              key={card.id}
              type='button'
              onClick={() => toggle(card.id)}
              className={`${styles.card} ${isSelected ? styles.selected : ''}`}
              aria-pressed={isSelected}
              aria-label={`${card.name} 카드 선택`}
            >
              <span className={styles.roman}>{card.roman}</span>
              <span className={styles.symbol} aria-hidden='true'>✦</span>
              <span className={styles.name}>{card.name}</span>
              <span className={styles.english}>{card.english}</span>
              <span className={styles.keyword}>{card.keyword}</span>
            </button>
          );
        })}
      </div>

      <aside className={styles.selectionPanel}>
        <div>
          <h2>선택한 카드</h2>
          <p>
            {selectedCards.length > 0
              ? selectedCards.map((card) => card.name).join(' · ')
              : '아직 선택한 카드가 없습니다.'}
          </p>
        </div>
        <button
          type='button'
          disabled={selected.length !== 3}
          className={styles.button}
          onClick={submit}
        >
          결과 보기
        </button>
      </aside>
    </main>
  );
}
