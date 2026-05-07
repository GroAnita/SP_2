import apiClient from './apiClient.js';
import { getAuthState } from '../state/authState.js';

export async function updateProfile(data) {
  console.log('NEW updateProfile running');
  const user = getAuthState();
  console.log('user:', user);
  console.log('data:', data);
  console.log('typeof name:', typeof user.name);
  if (!user) {
    throw new Error('You must be logged in to update your profile.');
  }
  return await apiClient(`/auction/profiles/${user.name}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
