import { deleteListing } from '../services/listingFetchService.js';
import showToast from '../ui/showToast.js';
import getHighestBidder from '../utils/getHighestBidder.js';
import { getAuthState } from '../state/authState.js';
import listingCardBase from './listingCardBase.js';
import listingDropdownMenu from './listingDropdownMenu.js';

/**
 * Creates a card element for a listing the user has bid on.
 *
 * Displays:
 * - Listing title and image
 * - Current highest bid and who has it
 * - Auction status (active / ended)
 * - Winning(losing) status for the current user
 * - Bid outcome (sold / not sold)
 *
 * Features:
 * - Dropdown menu (edit/delete)
 * - Delete functionality with confirmation
 * - Dynamic UI based on the auction state
 *
 * Behaviors:
 * - If listing data is invalid it then returns empty element
 * - Highlights if current user is the highest bidder
 * - Shows different states for active vs ended auctions
 *
 * Dependencies:
 * - deleteListing() → deletes listing via the API
 * - getHighestBidder() → calculates who the highest bidder is
 * - getAuthState() → retrieves current user
 *
 * @function myBidsCard
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
 * const card = myBidsCard(listing);
 * container.appendChild(card);
 */
export default function MyBidsCard(listing) {
  const user = getAuthState();
  const isOwner = listing.seller?.name === user?.name;
  const highestBid = listing.bids?.length
    ? Math.max(...listing.bids.map((b) => b.amount))
    : 0;

  const userBid = listing.bids?.find(
    (bid) => bid.bidder?.name === listing._user?.name
  );

  const whoIsWinning = document.createElement('p');
  const highestBidder = getHighestBidder(listing.bids);
  whoIsWinning.className = 'text-sm text-text font-semibold';
  if (highestBidder?.bidder?.name) {
    whoIsWinning.textContent = `Current highest bid: ${highestBid} by ${highestBidder.bidder.name}`;
  } else {
    whoIsWinning.textContent = `No bids yet. Be the first to bid!`;
  }

  const isWinner = userBid && userBid.amount === highestBid;

  const isActive = new Date(listing.endsAt) > new Date();

  /**
   * Creates a dropdown menu configurations object.
   *
   * The dropdown gets different actions depending on owner/not owner status:
   * - Owners can delete their own listings
   * - Non-owners only see default menu actions
   *
   * Uses conditional object spreading to only! inject the `onDelete`
   * handler when the current user is the owner of the listing.
   */
  const dropdown = listingDropdownMenu({
    listing,
    ...(isOwner && {
      onDelete: async () => {
        await deleteListing(listing.id);
      },
    }),
  });

  const extraContent = document.createElement('div');
  extraContent.className = 'flex flex-col gap-2';

  // status
  const status = document.createElement('p');

  status.className = 'text-sm font-medium';

  if (isActive) {
    status.textContent = 'Auction Active';
    status.classList.add('text-green-500');
  } else {
    status.textContent = isWinner ? 'You Won!' : 'You Lost..!';

    status.classList.add(isWinner ? 'text-green-500' : 'text-red-500');
  }

  extraContent.appendChild(status);
  extraContent.appendChild(whoIsWinning);

  /**
   * so this builds a reusable listing card using the shared base component.
   *
   * it passes:
   * - listing data for the main card content
   * - a dropdown menu for the card actions
   * - my extra custom content (status, highest bidder etc.)
   * - and a dynamic title link for SPA navigation
   */
  return listingCardBase(listing, {
    headerRight: dropdown,
    extraContent,
    titleLink: `/listing?id=${listing.id}`,
  });
}
