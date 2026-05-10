import listingCard from '../components/listingCard.js';
import { fetchListings } from '../services/listingService.js';
import Breadcrumbs from '../components/breadcrumbs.js';

/**
 * Creates and renders the Listings page.
 *
 * Features:
 * - Fetches paginated auction listings from the API
 * - Supports client-side sorting (newest, ending soon, active)
 * - Supports search filtering via URL query (?q=...)
 * - Displays listings in a responsive grid
 * - Handles pagination (next / previous)
 * - Updates listings in real-time when a bid is placed
 *
 * State handled internally:
 * - Current page number
 * - Loading state
 * - Last page detection
 * - Cached listings for sorting/filtering
 *
 * Events:
 * - Listens for "bid:placed" to update affected listing
 *
 * @async
 * @function Listings
 *
 * @returns {Promise<HTMLElement>} Fully constructed Listings page element
 *
 * @example
 * const view = await Listings();
 * document.getElementById('app').appendChild(view);
 */
export default async function Listings() {
  let page = 1;
  const limit = 17;
  let isLastPage = false;
  let isLoading = false;
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q');
  let currentListings = [];
  const id = params.get('id');

  const container = document.createElement('div');
  container.className = 'container w-2/3 mx-auto p-4  ';

  const breadcrumbs = Breadcrumbs([
    { label: 'Home', path: '/' },
    { label: 'Listings' },
  ]);
  container.appendChild(breadcrumbs);

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
    const sorted = sortListings([...currentListings], filterSelect.value);

    listingGrid.innerHTML = '';

    sorted.forEach((listing, index) => {
      const isFeatured = page === 1 && index === 4;
      listingGrid.appendChild(listingCard(listing, isFeatured));
    });
  });

  filterContainer.appendChild(filterSelect);
  container.appendChild(filterContainer);

  const listingGrid = document.createElement('div');
  listingGrid.className =
    'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-8 auto-rows-[300px] h-full relative mx-auto';

  listingGrid.innerHTML = '<p>Loading...</p>';

  const pagination = document.createElement('div');
  pagination.className = 'flex justify-center mt-6 gap-4';

  const prevButton = document.createElement('button');
  prevButton.className =
    'px-4 py-2 bg-primary text-text rounded-full disabled:opacity-40 disabled:cursor-not-allowed';
  prevButton.textContent = 'Previous';

  const pageIndicator = document.createElement('span');
  pageIndicator.className = 'text-text self-center font-medium';

  const nextButton = document.createElement('button');
  nextButton.className =
    'px-4 py-2 bg-primary text-text rounded-full disabled:opacity-40 disabled:cursor-not-allowed';
  nextButton.textContent = 'Next';

  container.appendChild(title);
  container.appendChild(listingGrid);

  pagination.appendChild(prevButton);
  pagination.appendChild(pageIndicator);
  pagination.appendChild(nextButton);
  container.appendChild(pagination);

  /**
   * Sorts listings based on selected type.
   *
   * @param {Listing[]} listings
   * @param {'newest' | 'ending-soon' | 'active' | ''} type
   * @returns {Listing[]}
   */
  function sortListings(listings, type) {
    const now = new Date();
    if (type === 'newest') {
      return [...listings].sort(
        (a, b) => new Date(b.created) - new Date(a.created)
      );
    }
    if (type === 'ending-soon') {
      return [...listings].sort(
        (a, b) => new Date(a.endsAt) - new Date(b.endsAt)
      );
    }
    if (type === 'active') {
      return [...listings].sort((a, b) => {
        const aActive = new Date(a.endsAt) > now;
        const bActive = new Date(b.endsAt) > now;

        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;

        return 0;
      });
    }
    return listings;
  }

  /**
   * Handles "bid:placed" event and updates the affected listing in the UI.
   *
   * @param {CustomEvent} e - Event containing listingId in e.detail
   * @returns {Promise<void>}
   */
  async function handleBidPlaced(e) {
    const { listingId } = e.detail;
    try {
      const updated = await fetchListings({ page, limit });
      const updatedListing = updated.data.find((l) => l.id === listingId);
      if (!updatedListing) return;

      currentListings = currentListings.map((l) =>
        l.id === listingId ? updatedListing : l
      );

      listingGrid.innerHTML = '';

      currentListings.forEach((listing, index) => {
        const isFeatured = page === 1 && index === 4;
        listingGrid.appendChild(listingCard(listing, isFeatured));
      });
    } catch (error) {
      console.error('Failed to update listing after bid:', error);
    }
  }

  document.removeEventListener('bid:placed', handleBidPlaced);
  document.addEventListener('bid:placed', handleBidPlaced);

  /**
   * Fetches listings from API and renders them in the grid.
   *
   * Handles:
   * - API fetching
   * - Search filtering
   * - Sorting
   * - Pagination state updates
   * - Empty state handling
   *
   * @async
   * @function loadListings
   * @returns {Promise<void>}
   */
  async function loadListings() {
    if (isLoading) return;
    isLoading = true;

    listingGrid.innerHTML = '<p>Loading...</p>';

    try {
      const result = await fetchListings({ page, limit });

      currentListings = result.data;
      let listings = [...currentListings];

      // 🔍 FILTER
      if (query) {
        listings = listings.filter((listing) => {
          const t = listing.title?.toLowerCase() || '';
          const d = listing.description?.toLowerCase() || '';
          return (
            t.includes(query.toLowerCase()) || d.includes(query.toLowerCase())
          );
        });
      }

      listings = sortListings(listings, filterSelect.value);

      // 🚫 EMPTY
      if (!listings.length && page === 1) {
        listingGrid.innerHTML = '<p>No listings found.</p>';
        return;
      }

      listingGrid.innerHTML = '';

      listings.forEach((listing, index) => {
        const isFeatured = page === 1 && index === 4;
        listingGrid.appendChild(listingCard(listing, isFeatured));
      });

      // pagination state
      isLastPage = listings.length < limit;
      prevButton.disabled = page === 1;
      nextButton.disabled = isLastPage;
      pageIndicator.textContent = `Page ${page}`;
    } catch (error) {
      console.error(error);
      listingGrid.innerHTML = '<p>Error loading listings.</p>';
    } finally {
      isLoading = false;
    }
  }
  nextButton.addEventListener('click', () => {
    if (isLastPage) return;
    page++;
    loadListings();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  prevButton.addEventListener('click', () => {
    if (page === 1) return;
    page--;
    loadListings();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  await loadListings();

  return container;
}
