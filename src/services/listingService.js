const baseURL = 'https://v2.api.noroff.dev';

export async function fetchListings() {
  try {
    const response = await fetch(
      `${baseURL}/auction/listings?sort=created&sortOrder=desc&_bids=true&_seller=true`
    );
    const json = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return json;
  } catch (error) {
    console.error('Error fetching the listings:', error);
    throw error;
  }
}
