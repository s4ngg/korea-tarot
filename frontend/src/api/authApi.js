import axiosInstance from './axiosInstance';

export const signup = (data) =>
  axiosInstance.post('/api/auth/signup', data);

export const sendEmailVerification = (data) =>
  axiosInstance.post('/api/auth/email/send', data);

export const verifyEmail = (data) =>
  axiosInstance.post('/api/auth/email/verify', data);

export const login = (data) =>
  axiosInstance.post('/api/auth/login', data);

export const logout = () =>
  axiosInstance.post('/api/auth/logout');

export const getMyProfile = () =>
  axiosInstance.get('/api/users/me');

export const updateMyProfile = (data) =>
  axiosInstance.put('/api/users/me', data);
