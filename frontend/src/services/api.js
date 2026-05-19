import axios from 'axios';
import useAuthStore from '../store/authStore';

export const api = axios.create({
  baseURL: 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const fallbackCards = [
  { id: 1, roman: 'I', name: '마법사', english: 'The Magician', keyword: '의지' },
  { id: 6, roman: 'VI', name: '연인', english: 'The Lovers', keyword: '선택' },
  { id: 17, roman: 'XVII', name: '별', english: 'The Star', keyword: '희망' },
];

const readSelectedCards = () => {
  try {
    const cards = JSON.parse(localStorage.getItem('selectedTarotCards') || '[]');
    return Array.isArray(cards) && cards.length > 0 ? cards : fallbackCards;
  } catch {
    return fallbackCards;
  }
};

export const fetchReadingHistory = async () => ([
  {
    id: 1,
    title: '오늘의 선택 리딩',
    date: '2026-05-19',
    summary: '마법사 · 연인 · 별',
    mood: '새로운 시작과 관계의 균형',
  },
  {
    id: 2,
    title: '직업 흐름 리딩',
    date: '2026-05-15',
    summary: '전차 · 정의 · 세계',
    mood: '목표를 향한 추진력',
  },
  {
    id: 3,
    title: '관계 회복 리딩',
    date: '2026-05-10',
    summary: '절제 · 태양 · 여사제',
    mood: '천천히 회복되는 신뢰',
  },
]);

export const fetchReadingResult = async (id = 'latest') => {
  const cards = readSelectedCards();
  const keywords = cards.map((card) => card.keyword).join(', ');

  return {
    id,
    title: '오늘의 타로 리딩',
    cards,
    interpretation: `선택한 카드는 ${cards.map((card) => card.name).join(', ')}입니다. 지금의 흐름은 ${keywords} 쪽으로 모이고 있어요. 급하게 결론을 내리기보다, 이미 손에 쥔 가능성을 차분히 정리하는 시간이 필요합니다.`,
    advice: '가장 먼저 떠오르는 선택지를 작게 실행해보세요. 오늘은 완벽한 확신보다 움직이면서 확인하는 태도가 더 잘 맞습니다.',
    sections: [
      {
        title: '현재',
        body: `${cards[0]?.name} 카드는 지금 당신이 새롭게 시작할 준비가 되어 있음을 보여줍니다.`,
      },
      {
        title: '흐름',
        body: `${cards[1]?.name} 카드는 관계나 선택의 갈림길에서 균형 감각이 중요하다고 말합니다.`,
      },
      {
        title: '조언',
        body: `${cards[2]?.name} 카드는 작은 희망의 신호를 놓치지 말라는 메시지를 전합니다.`,
      },
    ],
  };
};
