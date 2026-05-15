import { placeBid } from '../services/bidService.js';
import showToast from '../ui/showToast.js';
import { getAuthState } from '../state/authState.js';
import { closeModal, setupEscapeClose } from '../utils/modalUtils.js';

/**
 * Creates and displays a modal for placing bids on an auction listing.
 *
 * Features:
 * - Prevents guests from bidding
 * - Prevents users from bidding on their own listings
 * - Validates bid amounts
 * - Ensures bids are higher than the current highest bid
 * - Prevents bidding on expired listings
 * - Dispatches a custom "bid:placed" event after success
 * - Stores local bid history in localStorage
 * - Supports overlay click and Escape key closing
 *
 * @param {Object} listing - Listing data object.
 * @param {string} listing.id - Listing ID.
 * @param {string} listing.title - Listing title.
 * @param {string} listing.endsAt - Listing end date.
 * @param {Object} listing.seller - Seller information.
 * @param {string} listing.seller.name - Seller username.
 * @param {Array<Object>} [listing.bids] - Existing bids.
 *
 * @returns {void}
 */
export default function bidModal(listing) {
  const user = getAuthState();
  if (!user) {
    showToast('You must be logged in to place a bid.', 'warning');
    return;
  }

  const modal = document.createElement('div');
  modal.className =
    'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'bid-modal-title');
  modal.setAttribute('aria-describedby', 'bid-modal-description');

  const modalContent = document.createElement('div');
  modalContent.className = 'bg-card rounded-lg p-6 w-full max-w-md relative';

  const closeButton = document.createElement('button');
  closeButton.className =
    'absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300';
  closeButton.innerHTML = '&times;';
  closeButton.type = 'button';
  closeButton.addEventListener('click', () => {
    closeModal(modal);
  });

  const title = document.createElement('h2');
  title.className = 'text-2xl text-text font-bold mb-4';
  title.textContent = `Place a Bid on "${listing.title}"`;
  title.id = 'bid-modal-title';

  const form = document.createElement('form');
  form.className = 'flex flex-col gap-4';

  const bidLabel = document.createElement('label');
  bidLabel.textContent = 'Bid Amount';
  bidLabel.setAttribute('for', 'bid-amount');
  bidLabel.className = 'text-text font-semibold';

  const bidInput = document.createElement('input');
  bidInput.type = 'number';
  bidInput.placeholder = 'Enter your bid amount';
  bidInput.className =
    'input w-full border-2 border-gray-300 rounded focus:ring-2 focus:ring-primary';
  bidInput.id = 'bid-amount';
  bidInput.min = '1';

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className =
    'bg-primary text-header px-4 py-2 border border-text rounded transition';
  submitButton.textContent = 'Place Bid';

  if (listing.seller?.name === user?.name) {
    showToast('You cannot bid on your own listing.', 'warning');
    return;
  }

  form.appendChild(bidLabel);
  form.appendChild(bidInput);
  form.appendChild(submitButton);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const bidAmount = parseFloat(bidInput.value);

    if (isNaN(bidAmount) || bidAmount <= 0) {
      alert('Please enter a valid bid amount.');
      return;
    }
    /**
     * Prevent users from placing bids lower than or equal
     * to the current highest bid.
     */
    const highestBid = listing.bids?.length
      ? Math.max(...listing.bids.map((b) => b.amount))
      : 0;
    if (bidAmount <= highestBid) {
      showToast(
        `Your bid must be higher than the current highest bid of ${highestBid} Coins.`
      );
      return;
    }
    if (new Date(listing.endsAt) < new Date()) {
      showToast('This listing has already ended. You cannot place a bid.');
      return;
    }
    try {
      const result = await placeBid(listing.id, bidAmount);
      if (!result) return;

      showToast('Bid placed successfully!');
      closeModal(modal);
      /**
       * Notify other parts of the application that a new bid
       * has been placed so UI components can update in real time.
       */
      document.dispatchEvent(
        new CustomEvent('bid:placed', {
          detail: {
            listingId: listing.id,
            bid: result.data,
          },
        })
      );
    } catch (error) {
      console.error('BID ERROR:', error);
      showToast('Failed to place bid. Please try again.');
      return;
    }
  });

  setupEscapeClose(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });

  modalContent.appendChild(closeButton);
  modalContent.appendChild(title);
  modalContent.appendChild(form);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}
