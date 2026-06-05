import showToast from '../ui/showToast.js';

export default function deletesListingsHandler(e) {
  const deletedId = e.detail;
  const card = document.querySelector(`[data-listing-id="${deletedId}"]`);
  if (card) {
    card.remove();
    showToast('Listing deleted successfully!', 'success');
  }
}
