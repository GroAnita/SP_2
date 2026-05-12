import { deleteListing } from '../services/listingFetchService.js';
import showToast from '../ui/showToast.js';
import editOwnListing from './editOwnListing.js';
import listingCardBase from './listingCardBase.js';
import listingDropdownMenu from './listingDropdownMenu.js';
/**
 * Creates a card element for a listing owned by the current user.
 *
 * Displays:
 * - Listing title and image
 * - Current highest bid
 * - Auction status (active / ended)
 * - Sale outcome (sold / not sold)
 *
 * Features:
 * - Dropdown menu with actions:
 *   - Edit listing
 *   - Delete listing
 *   - Relist listing (only if auction has ended)
 *
 * Behavior:
 * - Determines if listing is active or ended based on `endsAt`
 * - Shows "Relist" option only for ended listings
 * - Confirms before deleting a listing
 * - Removes card from UI after successful deletion
 *
 * Dependencies:
 * - deleteListing() → deletes listing via API
 * - editOwnListing() → opens edit/relist UI
 * - getHighestBidder() → calculates highest bidder
 * - showToast() → displays success/error messages
 *
 * @function OwnListingCard
 *
 * @param {Object} listing - Listing object
 * @param {string} listing.id - Listing ID
 * @param {string} listing.title - Listing title
 * @param {string} listing.endsAt - Auction end date (ISO string)
 * @param {Array<Object>} listing.bids - Array of bids
 * @param {Array<Object>} [listing.media] - Listing images
 *
 * @returns {HTMLElement} Rendered card element
 *
 * @example
 * const card = OwnListingCard(listing);
 * container.appendChild(card);
 */
export default function OwnListingCard(listing) {
  const dropdown = listingDropdownMenu({
    listing,

    onEdit: () => {
      editOwnListing(listing);
    },

    onRelist: () => {
      editOwnListing(listing, {
        relist: true,
      });
    },

    onDelete: async () => {
      const confirmed = confirm(`Delete "${listing.title}"?`);

      if (!confirmed) return;

      try {
        await deleteListing(listing.id);

        showToast('Listing deleted', 'success');

        const card = dropdown.closest('[data-listing-card]');

        if (card) card.remove();
      } catch (error) {
        showToast(error.message, 'error');
      }
    },
  });

  const extraContent = document.createElement('div');
  extraContent.className = 'flex flex-col gap-2';

  const description = document.createElement('p');
  description.textContent = listing.description || 'No description provided.';

  description.className = 'text-sm text-text mb-2';

  extraContent.appendChild(description);

  return listingCardBase(listing, {
    headerRight: dropdown,
    titleLink: `/listing?id=${listing.id}`,
    extraContent,
  });
}
