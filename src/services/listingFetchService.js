import apiClient from './apiClient.js';

export default async function updateListing(id, data) {
  return await apiClient(`/auction/listings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function fetchListings() {
  return await apiClient('/auction/listings');
}

export async function deleteListing(id) {
  return await apiClient(`/auction/listings/${id}`, {
    method: 'DELETE',
  });
}
