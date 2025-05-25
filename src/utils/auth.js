import api from './api';

export const login = async (username, password) => {
  const response = await api.post('/login', { username, password });
  const { token, firstName, role, userId, email, phone } = response.data;
  localStorage.setItem('jwt', token);
  localStorage.setItem('user', JSON.stringify({ firstName, role, userId, email, phone }));
};

export const logout = () => {
  localStorage.removeItem('jwt');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const getUserId = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.userId;
};