import axiosInstance from './axiosInstance';

export const getCards = () =>
  axiosInstance.get('/api/tarot/cards');

export const createReading = (data) =>
  axiosInstance.post('/api/tarot/reading', data);
