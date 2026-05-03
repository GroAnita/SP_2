import apiClient from './apiClient.js';

export async function placeBid(listingId, amount) {
  return await apiClient(`/auction/listings/${listingId}/bids`, {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
}

export async function fetchBids(listingId) {
  return await apiClient(`/auction/listings/${listingId}/bids`);
}

export async function fetchMyBids() {
  return await apiClient('/auction/my-bids');
}
