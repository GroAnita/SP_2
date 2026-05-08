import apiClient from './apiClient.js';

export default async function updateListing(id, data) {
  return await apiClient(`/auction/listings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function fetchListings({ page = 1, limit = 17 } = {}) {
  try {
    const onlyActive = true;
    const result = await apiClient(
      `/auction/listings?_active=${onlyActive}true&_bids=true&_seller=true&page=${page}&limit=${limit}&sort=created&sortOrder=desc`
    );

    console.log('PAGE:', page);
    console.log(
      'IDS:',
      result.data.map((l) => l.id)
    );

    return result;
  } catch (error) {
    console.error('Error fetching the listings:', error);
    throw error;
  }
}

export async function deleteListing(id) {
  return await apiClient(`/auction/listings/${id}`, {
    method: 'DELETE',
  });
}
