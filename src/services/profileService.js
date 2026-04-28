import { apiClient } from './apiClient.js';

export async function fetchProfiles(params = '') {
  return await apiClient(`/auction/profiles${params}`);
}

export function fetchProfile(name, params = '') {
  return apiClient(`/auction/profiles/${name}${params}`);
}

export async function updateProfile(name, data) {
  return await apiClient(`/auction/profiles/${name}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteProfile(name) {
  return await apiClient(`/auction/profiles/${name}`, {
    method: 'DELETE',
  });
}

export function searchProfiles(query) {
  if (!query || query.trim()) return Promise.resolve({ data: [] });
  return apiClient(`/auction/profiles?search=${encodeURIComponent(query)}`);
}
