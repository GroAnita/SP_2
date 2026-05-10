import optimizeImageUrl from '../utils/optimizeImageUrl.js';

export default function listingCardBase(listing, options = {}) {
  if (!listing || !listing.title) {
    console.warn('Invalid listing data:', listing);
    return document.createElement('div'); // Return empty div for invalid data
  }
  const { headerRight, extraContent, titleLink } = options;

  const card = document.createElement('div');
  card.className =
    'bg-card border-2 h-full border-text rounded-lg p-4 flex flex-col gap-4 relative group';

  const header = document.createElement('div');
  header.className = 'flex items-center justify-between';

  const title = document.createElement(titleLink ? 'a' : 'h2');
  title.className =
    'text-xl text-text hover:text-secondary transition-colors font-semibold';
  title.textContent = listing.title;

  if (titleLink) {
    title.href = titleLink;
    title.setAttribute('data-link', '');
  }

  const now = new Date();
  const isActive = new Date(listing.endsAt) > now;
  const status = document.createElement('span');
  status.className =
    'text-sm font-medium px-2 py-1 mr-6 rounded-full' +
    (isActive ? 'bg-green-600 text-green-500' : 'bg-red-800 text-red-500');
  status.textContent = isActive ? 'Active' : 'Ended';

  header.appendChild(status);
  header.appendChild(title);
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
