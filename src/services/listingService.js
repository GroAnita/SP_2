import apiClient from './apiClient.js';

const baseURL = 'https://v2.api.noroff.dev';

export async function fetchListings({ page = 1, limit = 17 } = {}) {
  try {
    const result = await apiClient(
      `/auction/listings?page=${page}&limit=${limit}&sort=created&sortOrder=desc&_bids=true&_seller=true`
    );

    return result;
  } catch (error) {
    console.error('Error fetching the listings:', error);
    throw error;
  }
}
