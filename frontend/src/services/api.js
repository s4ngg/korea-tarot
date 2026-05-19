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

export const fetchReadingHistory = async () => ([
  { id: 1, title: '연애 운세', date: '2026-05-10', summary: '새로운 인연의 흐름' },
  { id: 2, title: '직업 운세', date: '2026-05-15', summary: '전환점을 앞둔 선택' },
]);

export const fetchReadingResult = async (id = 'latest') => ({
  id,
  title: '오늘의 아르카나',
  interpretation: '당신 앞에는 새로운 변화와 선택의 흐름이 열리고 있습니다.',
  advice: '직감을 믿고 천천히 앞으로 나아가세요.',
});
