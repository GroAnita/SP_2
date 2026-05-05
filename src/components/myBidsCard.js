import { deleteListing } from '../services/listingFetchService.js';
import showToast from '../ui/showToast.js';
import getHighestBidder from '../utils/getHighestBidder.js';
import { getAuthState } from '../state/authState.js';

export default function myBidsCard(listing) {
  const user = getAuthState();
  const card = document.createElement('div');
  card.className =
    'bg-card border-2 h-full border-text rounded-lg p-4 flex flex-col gap-4 relative group';

  const header = document.createElement('div');
  header.className = 'flex items-center justify-between';

  const title = document.createElement('h2');
  title.className = 'text-xl text-text font-semibold';
  title.textContent = listing.title;

  const editWrapper = document.createElement('div');
  editWrapper.className = 'absolute top-2 right-2';

  const editButton = document.createElement('button');
  editButton.className = 'text-text px-2 py-1 text-lg';
  editButton.textContent = '⋯';

  const dropdown = document.createElement('div');
  dropdown.className =
    'absolute right-0 mt-2 bg-card border border-text rounded shadow-md hidden flex flex-col z-50';

  const editOption = document.createElement('button');
  editOption.textContent = 'Edit';
  editOption.className = 'px-4 py-2 text-left hover:bg-secondary';

  const deleteOption = document.createElement('button');
  deleteOption.textContent = 'Delete';
  deleteOption.className =
    'px-4 py-2 text-left hover:bg-red-500 hover:text-white';

  dropdown.appendChild(editOption);
  dropdown.appendChild(deleteOption);

  editButton.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', () => {
    dropdown.classList.add('hidden');
  });

  editWrapper.appendChild(editButton);
  editWrapper.appendChild(dropdown);
  header.appendChild(editWrapper);

  deleteOption.addEventListener('click', async (e) => {
    e.stopPropagation();
    const confirmDelete = confirm(
      'Are you sure you want to delete this listing?'
    );
    if (!confirmDelete) return;
    try {
      await deleteListing(listing.id);
      card.remove();
      showToast('Listing deleted successfully.');
    } catch (error) {
      showToast('Failed to delete listing. Please try again later.');
    }
  });

  const now = new Date();
  const isActive = new Date(listing.endsAt) > now;

  const status = document.createElement('span');
  status.className =
    'text-sm font-medium px-2 py-1 mr-6 rounded-full ' +
    (isActive ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100');
  status.textContent = isActive ? 'Active' : 'Ended';

  const highest = getHighestBidder(listing.bids);

  const soldText = document.createElement('p');
  soldText.className = 'text-sm text-text mt-1';
  if (isActive) {
    soldText.textContent = 'Auction is live';
  } else {
    if (highest) {
      soldText.textContent = `Sold to ${highest.bidder?.name || 'Unknown'} for $${highest.amount} Coins`;
    } else {
      soldText.textContent = 'Not sold';
    }
  }

  const infoContainer = document.createElement('div');
  infoContainer.className = 'flex items-center gap-4';

  const image = document.createElement('img');
  image.alt = listing.title || 'Listing Image';
  image.className = 'w-32 h-32 object-cover rounded';
  const fallback = 'https://via.placeholder.com/400x300?text=No+Image';
  image.src = listing.media?.[0]?.url || fallback;

  const bidSection = document.createElement('div');
  bidSection.className = 'flex flex-col gap-2';

  const highestBid = listing.bids?.length
    ? Math.max(...listing.bids.map((bid) => bid.amount))
    : 0;

  const price = document.createElement('p');
  price.className = 'text-lg font-bold text-secondary';
  price.textContent = `Current Bid: $${highestBid} Coins`;

  const isWinning = highest?.bidder?.name === user.name;
  const statusText = document.createElement('p');
  statusText.className = isWinning ? 'text-green-500' : 'text-red-500';
  statusText.textContent = isWinning
    ? 'You are currently winning this auction!'
    : 'You have been outbid on this auction.';

  header.appendChild(title);
  header.appendChild(status);
  card.appendChild(header);

  infoContainer.appendChild(image);
  bidSection.appendChild(price);
  bidSection.appendChild(soldText);
  bidSection.appendChild(statusText);
  infoContainer.appendChild(bidSection);
  card.appendChild(infoContainer);
  return card;
}
