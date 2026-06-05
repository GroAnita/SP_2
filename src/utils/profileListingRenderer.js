import showToast from '../ui/showToast.js';

/**
 * Renders a list of listings into the profile section.
 *
 * Applies fade-out/fade-in animation during updates.
 *
 * @param {Array<Object>} listings - Array of listing objects
 * @param {Function} cardComponent - Function that returns a DOM card element
 *
 * @returns {void}
 */
export default function renderListings(listings, cardComponent, container) {
  container.classList.add('opacity-0');

  setTimeout(() => {
    container.innerHTML = '';
    if (listings.length === 0) {
      const message = document.createElement('p');
      message.role = 'status';
      message.textContent = 'No listings found.';
      container.replaceChildren(message);
    } else {
      listings.forEach((listing) => {
        if (!listing || !listing.title) {
          console.warn('Skipping invalid listing:', listing);
          return;
        }
        container.appendChild(cardComponent(listing));
      });
    }
    container.classList.remove('opacity-0');
  }, 150);
}
