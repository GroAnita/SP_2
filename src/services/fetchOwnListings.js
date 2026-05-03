import apiClient from './apiClient.js';
import { getAuthState } from '../state/authState.js';

export async function fetchOwnListings() {
  const user = getAuthState();

  if (!user?.name) {
    throw new Error('User not logged in');
  }

  const response = await apiClient(
    '/auction/listings?sort=created&sortOrder=desc&_seller=true&_bids=true'
  );

  const myListings = response.data.filter(
    (listing) => listing.seller?.name === user.name
  );

  return myListings;
}
