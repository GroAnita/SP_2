import { deleteListing } from '../services/listingFetchService.js';
import showToast from '../ui/showToast.js';

export default function OwnListingCard(listing) {
  const card = document.createElement('div');
  card.className =
    'bg-card border-2 h-full border-text rounded-lg p-4 flex flex-col gap-4 relative group';

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
  card.appendChild(editWrapper);

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
      console.log('Delete failed:', error);
      showToast('Failed to delete listing. Please try again later.');
    }
  });

  const now = new Date();
  const isActive = new Date(listing.endsAt) > now;

  const status = document.createElement('span');
  status.className =
    'text-sm font-medium px-2 py-1 rounded-full ' +
    (isActive ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100');
  status.textContent = isActive ? 'Active' : 'Ended';

  const image = document.createElement('img');
  image.alt = listing.title || 'Listing Image';
  image.className = 'w-48 h-48 object-cover mx-auto rounded';
  const fallback = 'https://via.placeholder.com/400x300?text=No+Image';
  image.src = listing.media?.[0]?.url || fallback;

  const highestBid = listing.bids?.length
    ? Math.max(...listing.bids.map((bid) => bid.amount))
    : 0;

  const price = document.createElement('p');
  price.className = 'text-lg font-bold text-secondary';
  price.textContent = `Current Bid: $${highestBid} Coins`;

  card.appendChild(title);

  card.appendChild(status);
  card.appendChild(image);
  card.appendChild(price);

  return card;
}
