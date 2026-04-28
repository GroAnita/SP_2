import { apiClient } from './apiClient.js';

export async function createListing(data) {
  return await apiClient('/auction/listings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchSingleListing(id) {
  return await apiClient(`/auction/listings/${id}`);
}

export async function fetchListingById(id) {
  return await apiClient(`/auction/listings/${id}`);
}

export async function deleteListing(id) {
  return await apiClient(`/auction/listings/${id}`, {
    method: 'DELETE',
  });
}
