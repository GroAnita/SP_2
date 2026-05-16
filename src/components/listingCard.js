import { updateCountdown } from '../utils/countDown.js';
import { imageFallback } from '../utils/imageFallback.js';

/**
 * Creates a clickable auction listing card.
 *
 * Features:
 * - Displays listing image with fallback support
 * - Shows highest bid amount
 * - Displays countdown timer until auction ends
 * - Supports featured card layout
 * - Uses SPA navigation via data-link
 * - Adds hover animations and overlays
 *
 * Card types:
 * - Standard listing card
 * - Featured listing card (larger highlighted layout)
 *
 * Dependencies:
 * - updateCountdown()
 * - imageFallback()
 *
 * @function ListingCard
 *
 * @param {Object} listing - Listing data object.
 * @param {string} listing.id - Listing ID.
 * @param {string} listing.title - Listing title.
 * @param {string} [listing.endsAt] - Auction end date.
 * @param {Array<Object>} [listing.media] - Listing media array.
 * @param {Array<Object>} [listing.bids] - Listing bids array.
 *
 * @param {boolean} [isFeatured=false]
 * Determines whether the card should render
 * in featured layout mode.
 *
 * @returns {HTMLAnchorElement}
 * Fully constructed clickable listing card element.
 *
 * @example
 * const card = ListingCard(listing);
 * listingGrid.appendChild(card);
 *
 * @example
 * const featuredCard = ListingCard(listing, true);
 * heroSection.appendChild(featuredCard);
 */
export default function ListingCard(listing, isFeatured = false) {
  const bids = listing.bids || [];
  const media = listing.media || [];

  const fallback = `${import.meta.env.BASE_URL}images/lemonmascot-1.png`;

  const card = document.createElement('a');

  card.href = `/listing?id=${listing.id}`;
  card.dataset.link = '';

  if (isFeatured) {
    card.className =
      'relative md:col-span-2 md:row-span-2 h-full overflow-hidden rounded-lg cursor-pointer group';

    const image = document.createElement('img');
    image.alt = `${listing.title} || 'Listing Image'`;
    image.className =
      'w-full h-full object-cover absolute inset-0 z-0 transition duration-500 group-hover:scale-105';
    imageFallback(image, listing.media?.[0]?.url, fallback);

    const overlay = document.createElement('div');
    overlay.className =
      'absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10';

    const content = document.createElement('div');
    content.className =
      'absolute bottom-0 p-4 text-white z-20 flex flex-col gap-2';

    const badge = document.createElement('span');
    badge.textContent = 'Featured Listing';
    badge.className = 'bg-primary text-black px-2 py-1 font-bold rounded w-fit';

    const title = document.createElement('h2');
    title.textContent = listing.title || 'Untitled Listing';
    title.className = 'text-lg font-bold';

    const bid = document.createElement('p');
    bid.textContent = `Highest Bid: ${getHighestBid(listing.bids)} Coins`;
    bid.className = 'font-bold';

    content.appendChild(badge);
    content.appendChild(title);
    content.appendChild(bid);

    card.appendChild(image);
    card.appendChild(overlay);
    card.appendChild(content);

    return card;
  }

  card.className =
    'relative h-full overflow-hidden rounded-lg cursor-pointer group';

  const image = document.createElement('img');
  image.alt = listing.title;
  image.className =
    'w-full h-full object-cover absolute inset-0 z-0 transition duration-500 group-hover:scale-105';
  imageFallback(image, listing.media?.[0]?.url, fallback);

  const overlay = document.createElement('div');
  overlay.className =
    'absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10';

  const content = document.createElement('div');
  content.className =
    'absolute bottom-0 p-3 text-white bg-black/40 z-20 flex flex-col gap-1 w-full';

  const title = document.createElement('h2');
  title.textContent = listing.title;
  title.className = 'text-sm text-primary  font-bold font-inter line-clamp-2';

  const bid = document.createElement('p');
  bid.textContent = `Highest Bid: ${getHighestBid(listing.bids)} Coins`;
  bid.className = 'text-xs font-semibold text-white';

  // TIME
  const time = document.createElement('span');
  time.className = 'text-xs';

  if (!listing.endsAt) {
    time.textContent = 'No end time';
  } else {
    const endTime = new Date(listing.endsAt);

    if (!isNaN(endTime.getTime())) {
      const intervalId = updateCountdown(time, endTime);
      time._intervalId = intervalId;
    } else {
      time.textContent = 'Invalid end time';
    }
  }

  content.appendChild(title);
  content.appendChild(bid);
  content.appendChild(time);

  card.appendChild(image);
  card.appendChild(overlay);
  card.appendChild(content);

  return card;
}

/**
 * Finds the highest bid amount from a bids array.
 *
 * @function getHighestBid
 *
 * @param {Array<Object>} [bids=[]] - Array of bid objects.
 * @param {number} bids[].amount - Bid value.
 *
 * @returns {number}
 * Highest bid amount.
 * Returns 0 if no bids exist.
 *
 * @example
 * getHighestBid([{ amount: 50 }, { amount: 100 }]);
 * // Returns: 100
 */
function getHighestBid(bids = []) {
  if (!bids.length) return 0;
  return Math.max(...bids.map((bid) => bid.amount));
}
