import listingCard from '../components/listingCard.js';
import { fetchListings } from '../services/listingService.js';

export default async function Listings() {
  const container = document.createElement('div');
  container.className = 'container w-2/3 mx-auto p-4  ';

  const title = document.createElement('h1');
  title.className = 'text-3xl font-bold mb-4';
  title.textContent = 'Listings';
  const listingGrid = document.createElement('div');
  listingGrid.className =
    'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-8 auto-rows-[300px] h-full relative';

  listingGrid.innerHTML = '<p>Loading...</p>';

  container.appendChild(title);
  container.appendChild(listingGrid);

  try {
    const result = await fetchListings();
    console.log('Fetched listings:', result);
    console.log('First listing:', result.data[0]);
    const listings = result.data;
    listingGrid.innerHTML = '';
    listings.forEach((listing, index) => {
      const isFeatured = index === 4;
      const cardEl = listingCard(listing, isFeatured);
      listingGrid.appendChild(cardEl);
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    listingGrid.innerHTML =
      '<p>Error loading listings. Please try again later.</p>';
  }

  return container;
}
