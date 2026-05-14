import optimizeImageUrl from '../utils/optimizeImageUrl.js';

/**
 * Creates a reusable base card component for auction listings.
 *
 * Features:
 * - Displays listing title, image, and highest bid
 * - Shows active/ended status badge
 * - Supports optional dropdown/actions area
 * - Supports optional extra content section
 * - Supports my SPA navigation with clickable title/cards
 * - Falls back safely if invalid listing data is provided
 *
 * Used as the shared layout for:
 * - Own listings
 * - Bid listings
 * - Other reusable listing card variants
 *
 * @function listingCardBase
 *
 * @param {Object} listing - Listing data object.
 * @param {string} listing.id - Unique listing ID.
 * @param {string} listing.title - Listing title.
 * @param {string} listing.endsAt - Auction end date.
 * @param {Array<Object>} [listing.media] - Listing media array.
 * @param {Array<Object>} [listing.bids] - Array of bids.
 *
 * @param {Object} [options={}] - Optional card configuration.
 * @param {HTMLElement} [options.headerRight] - Element rendered in the top-right corner (dropdown/actions).
 * @param {HTMLElement} [options.extraContent] - Additional content rendered below the bid section.
 * @param {string} [options.titleLink] - SPA route used for clickable titles/cards.
 *
 * @returns {HTMLAnchorElement|HTMLDivElement}
 * A fully rendered listing card element.
 *
 * @example
 * const card = listingCardBase(listing, {
 *   headerRight: dropdown,
 *   extraContent: description,
 *   titleLink: `/listing?id=${listing.id}`,
 * });
 *
 * container.appendChild(card);
 */
export default function listingCardBase(listing, options = {}) {
  /**
   * To make sure it doesnt break if I get invalid or no data, So it
   * then returns an empty div insted of breaking the entire page.
   */
  if (!listing || !listing.title) {
    console.warn('Invalid listing data:', listing);
    return document.createElement('div');
  }

  const { headerRight, extraContent, titleLink } = options;

  //Clickable card if titleLink is provided, otherwise just a div
  const card = titleLink
    ? document.createElement('a')
    : document.createElement('div');
  card.className =
    'bg-card border-2 h-full border-text rounded-lg p-4 flex flex-col gap-4 relative group';
  card.dataset.listingId = listing.id;

  //top row , title and status and dropdown if its own listing
  const header = document.createElement('div');
  header.className = 'relative flex items-center';

  const titleWrapper = document.createElement('h2');
  titleWrapper.className =
    'text-xl text-text text-center w-full hover:text-secondary transition-colors font-semibold';

  //If there is a link, make the title an anchor tag, otherwise just a span
  const title = titleLink
    ? document.createElement('a')
    : document.createElement('span');
  title.textContent = listing.title;
  title.href = titleLink;
  title.dataset.link = '';

  //checks if the listing is active or not and adds the status badge accordingly
  const now = new Date();
  const isActive = new Date(listing.endsAt) > now;
  const status = document.createElement('span');
  status.className =
    'text-sm font-medium px-2 py-1 mr-6 rounded-full ' +
    (isActive ? 'bg-green-600 text-green-300' : 'bg-red-800 text-red-300');
  status.textContent = isActive ? 'Active' : 'Ended';

  header.appendChild(status);
  titleWrapper.appendChild(title);
  header.appendChild(titleWrapper);
  if (headerRight) {
    header.appendChild(headerRight);
  }
  card.appendChild(header);

  const infoContainer = document.createElement('div');
  infoContainer.className = 'flex items-center gap-4';

  const image = document.createElement('img');
  image.alt = listing.title;
  image.className = 'w-32 h-32 object-cover rounded';
  const fallback = 'https://via.placeholder.com/400x300?text=No+Image';
  image.src = optimizeImageUrl(listing.media?.[0]?.url, 400) || fallback;

  const bidSection = document.createElement('div');
  bidSection.className = 'flex flex-col gap-2';

  // does this listing have bids? if so show the highest bid, or "No bids yet"
  const highestBid = listing.bids?.length
    ? Math.max(...listing.bids.map((b) => b.amount))
    : 0;

  const price = document.createElement('p');
  price.className = 'text-lg font-bold text-secondary';
  price.textContent = `Current Bid: $${highestBid} Coins`;

  bidSection.appendChild(price);

  if (extraContent) {
    bidSection.appendChild(extraContent);
  }

  infoContainer.appendChild(image);
  infoContainer.appendChild(bidSection);
  card.appendChild(infoContainer);

  return card;
}
