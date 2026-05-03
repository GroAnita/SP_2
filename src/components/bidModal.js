import { placeBid } from '../services/bidService.js';
import showToast from '../ui/showToast.js';

export default function bidModal(listing) {
  const modal = document.createElement('div');
  modal.className =
    'fixed inset-0 bg-black/50 flex items-center justify-center z-50';

  const modalContent = document.createElement('div');
  modalContent.className =
    'bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md relative';

  const closeButton = document.createElement('button');
  closeButton.className =
    'absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300';
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  const title = document.createElement('h2');
  title.className = 'text-2xl font-bold mb-4';
  title.textContent = `Place a Bid on "${listing.title}"`;

  const form = document.createElement('form');
  form.className = 'flex flex-col gap-4';

  const bidInput = document.createElement('input');
  bidInput.type = 'number';
  bidInput.placeholder = 'Enter your bid amount';
  bidInput.className =
    'input w-full border-2 border-gray-300 rounded focus:ring-2 focus:ring-primary';

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className =
    'bg-primary text-text px-4 py-2 border border-text rounded hover:bg-primary-dark transition';
  submitButton.textContent = 'Place Bid';

  form.appendChild(bidInput);
  form.appendChild(submitButton);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const bidAmount = parseFloat(bidInput.value);
    if (isNaN(bidAmount) || bidAmount <= 0) {
      alert('Please enter a valid bid amount.');
      return;
    }
    const highestBid = listing.bids?.length
      ? Math.max(...listing.bids.map((b) => b.amount))
      : 0;
    if (bidAmount <= highestBid) {
      showToast(
        `Your bid must be higher than the current highest bid of ${highestBid} credits.`
      );
      return;
    }
    if (new Date(listing.endsAt) < new Date()) {
      showToast('This listing has already ended. You cannot place a bid.');
      return;
    }
    try {
      const result = await placeBid(listing.id, bidAmount);
      console.log('BID SUCCESS:', result);
      showToast('Bid placed successfully!');
      document.body.removeChild(modal);
      document.dispatchEvent(
        new CustomEvent('bid:placed', { detail: result.data })
      );
    } catch (error) {
      console.error('BID ERROR:', error);
      showToast('Failed to place bid. Please try again.');
    }
  });

  modalContent.appendChild(closeButton);
  modalContent.appendChild(title);
  modalContent.appendChild(form);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}
