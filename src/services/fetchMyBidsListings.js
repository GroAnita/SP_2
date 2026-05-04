import apiClient from './apiClient.js';
import { getAuthState } from '../state/authState.js';

export async function fetchMyBidsListings() {
  const user = getAuthState();
  const response = await apiClient(`/auction/listings?_bids=true`);
  const listings = response.data;
  return listings.filter((listing) =>
    listing.bids?.some((bid) => bid.bidder?.name === user.name)
  );
}
