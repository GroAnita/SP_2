import { updateCountdown } from '../utils/countDown.js';
import { imageFallback } from '../utils/imageFallback.js';

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

function getHighestBid(bids = []) {
  if (!bids.length) return 0;
  return Math.max(...bids.map((bid) => bid.amount));
}
