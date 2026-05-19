import axiosInstance from './axiosInstance';

export const getReadings = () =>
  axiosInstance.get('/api/readings');

export const getReadingDetail = (id) =>
  axiosInstance.get(`/api/readings/${id}`);

export const deleteReading = (id) =>
  axiosInstance.delete(`/api/readings/${id}`);
