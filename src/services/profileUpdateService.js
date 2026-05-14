import apiClient from './apiClient.js';
import { getAuthState } from '../state/authState.js';

export async function updateProfile(data) {
  const user = getAuthState();

  if (!user) {
    throw new Error('You must be logged in to update your profile.');
  }
  return await apiClient(`/auction/profiles/${user.name}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
