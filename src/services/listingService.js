import apiClient from './apiClient.js';

export async function fetchListings({ page = 1, limit = 17, query = '' } = {}) {
  try {
    let endpoint = `/auction/listings?page=${page}&limit=${limit}&sort=created&sortOrder=desc&_bids=true&_seller=true`;

    if (query) {
      endpoint += `&q=${encodeURIComponent(query)}`;
    }

    const result = await apiClient(endpoint);

    return result;
  } catch (error) {
    console.error('Error fetching the listings:', error);
    throw error;
  }
}
