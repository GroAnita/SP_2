import listingCard from '../components/listingCard.js';
import { fetchListings } from '../services/listingService.js';
import Breadcrumbs from '../components/breadcrumbs.js';
import Loader from '../components/loader.js';

/**
 * Creates and renders the Listings page.
 *
 * Features:
 * - Fetches auction listings from the API
 * - Supports API-driven:
 *   - searching
 *   - sorting
 *   - filtering
 *   - pagination
 * - Syncs filters with URL query parameters
 * - Displays listings in a responsive grid
 * - Supports browser navigation via History API
 * - Updates listings reactively when bids are placed
 *
 * Supported URL params:
 * - ?q=searchterm
 * - ?tag=gaming
 * - ?active=true
 * - ?sort=created
 * - ?sortOrder=desc
 *
 * State handled internally:
 * - Current page number
 * - Loading state
 * - Pagination state
 * - Cached listing updates
 *
 * Events:
 * - Listens for "bid:placed"
 * - Re-fetches updated listing data
 *
 * UI Features:
 * - Loading spinner
 * - Empty states
 * - Pagination controls
 * - Sorting controls
 *
 * @async
 * @function Listings
 *
 * @returns {Promise<HTMLElement>}
 * Fully rendered listings page.
 *
 * @example
 * const view = await Listings();
 * document.getElementById('app').appendChild(view);
 */
export default async function Listings() {
  let page = 1;
  const limit = 18;
  let isLastPage = false;
  let isLoading = false;
  let currentListings = [];

  const container = document.createElement('main');
  container.className = 'container w-2/3 mx-auto p-4  ';
  container.setAttribute('aria-labelledby', 'listings-heading');

  const breadcrumbs = Breadcrumbs([
    { label: 'Home', path: '/' },
    { label: 'Listings' },
  ]);
  container.appendChild(breadcrumbs);

  const title = document.createElement('h1');
  title.className = 'text-3xl text-text font-poppins font-bold mb-4';
  title.textContent = 'Listings';
  title.id = 'listings-heading';

  const filterContainer = document.createElement('section');
  filterContainer.className = 'flex justify-end mb-4 gap-4';

  const filterLabel = document.createElement('label');
  filterLabel.htmlFor = 'listing-sort';
  filterLabel.className = 'sr-only';
  filterLabel.textContent = 'Sort listings:';

  const filterSelect = document.createElement('select');
  filterSelect.className =
    'input w-48 bg-card border-2 border-primary text-text focus:ring-primary';
  filterSelect.innerHTML = `
    <option value="">Sort By</option>
    <option value="newest">Newest</option>
    <option value="ending-soon">Ending Soon</option>
    <option value="active">Active First</option>
  `;
  filterSelect.id = 'listing-sort';

  filterSelect.addEventListener('change', () => {
    const params = new URLSearchParams(window.location.search);

    switch (filterSelect.value) {
      case 'newest':
        params.set('sort', 'created');
        params.set('sortOrder', 'desc');
        params.delete('active');
        break;

      case 'ending-soon':
        params.set('sort', 'endsAt');
        params.set('sortOrder', 'desc');
        params.delete('active');
        break;

      case 'active':
        params.set('active', 'true');
        params.set('sort', 'created');
        params.set('sortOrder', 'desc');
        break;

      default:
        params.delete('sort');
        params.delete('sortOrder');
        params.delete('active');
    }

    history.pushState({}, '', `?${params.toString()}`);

    page = 1;

    loadListings();
  });

  filterContainer.appendChild(filterLabel);
  filterContainer.appendChild(filterSelect);
  container.appendChild(filterContainer);

  const listingGrid = document.createElement('div');
  listingGrid.className =
    'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-8 auto-rows-[300px] h-full relative mx-auto';

  listingGrid.setAttribute('aria-busy', 'true');
  listingGrid.innerHTML = '';
  listingGrid.appendChild(Loader('lg'));
  listingGrid.setAttribute('aria-busy', 'false');

  const pagination = document.createElement('div');
  pagination.className = 'flex justify-center mt-6 gap-4';

  const prevButton = document.createElement('button');
  prevButton.className =
    'px-4 py-2 bg-primary text-black rounded-full disabled:opacity-40 disabled:cursor-not-allowed';
  prevButton.textContent = 'Previous';
  prevButton.setAttribute('aria-label', 'Go to previous page');

  const pageIndicator = document.createElement('span');
  pageIndicator.className = 'text-text self-center font-medium';

  const nextButton = document.createElement('button');
  nextButton.className =
    'px-4 py-2 bg-primary text-black rounded-full disabled:opacity-40 disabled:cursor-not-allowed';
  nextButton.textContent = 'Next';
  nextButton.setAttribute('aria-label', 'Go to next page');

  container.appendChild(title);
  container.appendChild(listingGrid);

  pagination.appendChild(prevButton);
  pagination.appendChild(pageIndicator);
  pagination.appendChild(nextButton);
  container.appendChild(pagination);

  /**
   * Handles "bid:placed" event and updates the affected listing in the UI.
   *
   * @param {CustomEvent} e - Event containing listingId in e.detail
   * @returns {Promise<void>}
   */
  async function handleBidPlaced(e) {
    const { listingId } = e.detail;
    try {
      const currentParams = new URLSearchParams(window.location.search);

      const updated = await fetchListings({
        page,
        limit,
        query: currentParams.get('q')?.trim() || '',
        tag: currentParams.get('tag')?.trim() || '',
        sort: currentParams.get('sort') || 'created',
        sortOrder: currentParams.get('sortOrder') || 'desc',
        active: currentParams.get('active') === 'true',
      });
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

    listingGrid.innerHTML = '';
    listingGrid.appendChild(Loader('lg'));

    try {
      const currentParams = new URLSearchParams(window.location.search);

      const result = await fetchListings({
        page,
        limit,
        query: currentParams.get('q')?.trim() || '',
        tag: currentParams.get('tag')?.trim() || '',
        sort: currentParams.get('sort') || 'created',
        sortOrder: currentParams.get('sortOrder') || 'desc',
        active: currentParams.get('active') === 'true',
      });

      currentListings = result.data;
      let listings = [...currentListings];

      if (!listings.length && page === 1) {
        listingGrid.innerHTML =
          '<p role="status" class="text-text"> No listings found.</p>';
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
      listingGrid.innerHTML =
        '<p role="alert" class="text-text"> Error loading listings.</p>';
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
