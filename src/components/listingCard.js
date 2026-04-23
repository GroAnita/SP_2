import { updateCountdown } from '../utils/countDown.js';

export default function ListingCard(listing, isFeatured = false) {
  const card = document.createElement('div');

  card.addEventListener('click', () => {
    openListingModal(listing);
  });

  if (isFeatured) {
    card.className =
      'relative md:col-span-2 md:row-span-2 h-full overflow-hidden rounded-lg cursor-pointer group';

    const image = document.createElement('img');
    image.src = listing.media?.[0]?.url || '/images/Lemonmascot.png';
    image.alt = listing.title || 'Listing Image';
    image.className =
      'w-full h-full object-cover absolute inset-0 z-0 transition duration-500 group-hover:scale-105';

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
    title.textContent = listing.title;
    title.className = 'text-lg font-bold';

    const bid = document.createElement('p');
    bid.textContent = `Highest Bid: ${getHighestBid(listing.bids)} credits`;
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
  image.src = listing.media?.[0]?.url || '/images/Lemonmascot.png';
  image.alt = listing.title;
  image.className =
    'w-full h-full object-cover absolute inset-0 z-0 transition duration-500 group-hover:scale-105';

  const overlay = document.createElement('div');
  overlay.className =
    'absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10';

  const content = document.createElement('div');
  content.className =
    'absolute bottom-0 p-3 text-white z-20 flex flex-col gap-1 w-full';

  const title = document.createElement('h2');
  title.textContent = listing.title;
  title.className = 'text-sm font-bold truncate';

  const bid = document.createElement('p');
  bid.textContent = `Highest Bid: ${getHighestBid(listing.bids)} credits`;
  bid.className = 'text-xs';

  const favorite = document.createElement('i');
  favorite.className =
    'fa-solid fa-heart absolute top-2 right-2 text-pink-500 text-xl opacity-70 hover:opacity-100 transition';

  // TIME
  const time = document.createElement('span');
  time.className = 'text-xs';

  const endTime = new Date(listing.endsAt);

  const intervalId = updateCountdown(time, endTime);
  time._intervalId = intervalId;

  content.appendChild(title);
  content.appendChild(bid);
  content.appendChild(time);

  card.appendChild(image);
  card.appendChild(favorite);
  card.appendChild(overlay);
  card.appendChild(content);

  return card;
}

function getHighestBid(bids = []) {
  if (!bids.length) return 0;
  return Math.max(...bids.map((bid) => bid.amount));
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
