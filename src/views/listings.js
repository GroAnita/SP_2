import listingCard from '../components/listingCard.js';
import { fetchListings } from '../services/listingService.js';

let page = 0;
const limit = 17;
let isLastPage = false;
let isLoading = false;

async function loadListings() {
  if (isLoading || isLastPage) return;
  isLoading = true;
  try {
    const result = await fetchListings({ page, limit });
    const listings = result.data;

    if (listings.length < limit) {
      isLastPage = true;
    }

    listings.forEach((listing, index) => {
      const isFeatured = page === 0 && index === 4;
      const cardEl = listingCard(listing, isFeatured);
      listingGrid.appendChild(cardEl);
    });

    page++;
  } catch (error) {
    console.error('Error fetching listings:', error);
    if (page === 0) {
      listingGrid.innerHTML =
        '<p>Error loading listings. Please try again later.</p>';
    }
  } finally {
    isLoading = false;
  }
}

export default async function Listings() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q');

  const container = document.createElement('div');
  container.className = 'container w-2/3 mx-auto p-4  ';

  const title = document.createElement('h1');
  title.className = 'text-3xl text-text font-poppins font-bold mb-4';
  title.textContent = 'Listings';

  const filterContainer = document.createElement('section');
  filterContainer.className = 'flex justify-end mb-4 gap-4';

  const filterSelect = document.createElement('select');
  filterSelect.className =
    'input w-48 bg-card border-2 border-primary text-text focus:ring-primary';
  filterSelect.innerHTML = `
    <option value="">Sort By</option>
    <option value="newest">Newest</option>
    <option value="ending-soon">Ending Soon</option>
    <option value="active">Active First</option>
  `;

  filterSelect.addEventListener('change', () => {
    const value = filterSelect.value;
    let sortedListings = Array.from(
      container.querySelectorAll('.listing-card')
    );

    if (value === 'newest') {
      sortedListings.sort((a, b) => {
        const aDate = new Date(a.dataset.created);
        const bDate = new Date(b.dataset.created);
        return bDate - aDate;
      });
    } else if (value === 'ending-soon') {
      sortedListings.sort((a, b) => {
        const aEndsAt = new Date(a.dataset.endsAt);
        const bEndsAt = new Date(b.dataset.endsAt);
        return aEndsAt - bEndsAt;
      });
    } else if (value === 'active') {
      const now = new Date();
      sortedListings.sort((a, b) => {
        const aActive = new Date(a.dataset.endsAt) > now;
        const bActive = new Date(b.dataset.endsAt) > now;

        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;

        return 0;
      });
    }

    sortedListings.forEach((card) => container.appendChild(card));
  });

  filterContainer.appendChild(filterSelect);
  container.appendChild(filterContainer);

  const listingGrid = document.createElement('div');
  listingGrid.className =
    'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-8 auto-rows-[300px] h-full relative';

  listingGrid.innerHTML = '<p>Loading...</p>';

  const pagination = document.createElement('div');
  pagination.className = 'flex justify-center mt-6 gap-4';

  const prevButton = document.createElement('button');
  prevButton.className =
    'px-4 py-2 bg-primary text-text rounded-full disabled:bg-gray-400';
  prevButton.textContent = 'Previous';

  const nextButton = document.createElement('button');
  nextButton.className =
    'px-4 py-2 bg-primary text-text rounded-full disabled:bg-gray-400';
  nextButton.textContent = 'Next';

  container.appendChild(title);
  container.appendChild(listingGrid);

  pagination.appendChild(prevButton);
  pagination.appendChild(nextButton);
  container.appendChild(pagination);

  const now = new Date();

  try {
    const result = await fetchListings();

    let listings = result.data;
    if (query) {
      listings = listings.filter((listing) => {
        const title = listing.title?.toLowerCase() || '';
        const description = listing.description?.toLowerCase() || '';

        return (
          title.includes(query.toLowerCase()) ||
          description.includes(query.toLowerCase())
        );
      });
      title.textContent = `Search results for "${query}"`;
    }
    if (!listings.length) {
      listingGrid.innerHTML = '<p>No listings found.</p>';
      return container;
    }

    listings = listings.sort((a, b) => {
      const now = new Date();

      const aActive = new Date(a.endsAt) > now;
      const bActive = new Date(b.endsAt) > now;

      // Active first
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;

      // 🔥 NEWEST FIRST (for both active + inactive)
      return new Date(b.created) - new Date(a.created);
    });

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
