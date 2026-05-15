import apiClient from './apiClient.js';

export async function fetchListings({
  page = 1,
  limit = 18,
  query = '',
  tag = '',
  active = false,
  sort = 'created',
  sortOrder = 'desc',
} = {}) {
  try {
    const params = new URLSearchParams({
      page,
      limit,
      sort,
      sortOrder,
      _bids: true,
      _seller: true,
    });

    if (query.trim()) {
      params.append('q', query.trim());
    }
    if (tag.trim()) {
      params.append('tag', tag.trim());
    }
    if (active) {
      params.append('active', 'true');
    }

    const endpoint = `/auction/listings?${params.toString()}`;

    return await apiClient(endpoint);
  } catch (error) {
    console.error('Error fetching the listings:', error);
    throw error;
  }
}
