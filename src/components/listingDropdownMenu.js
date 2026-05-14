import confirmModal from './confirmModal';

/**
 * Creates a dropdown action menu for a listing card.
 *
 * Features:
 * - Toggleable dropdown menu
 * - Edit and delete actions
 * - Relist action for inactive listings
 * - Closes when clicking outside
 * - Closes on Escape key press
 * - Accessible button and menu controls
 *
 * @param {Object} params - Dropdown configuration object.
 * @param {Object} params.listing - Listing data object.
 * @param {string} params.listing.title - Listing title.
 * @param {string} params.listing.endsAt - Listing end date.
 * @param {Function} [params.onEdit] - Callback fired when edit is clicked.
 * @param {Function} [params.onDelete] - Callback fired when delete is clicked.
 * @param {Function} [params.onRelist] - Callback fired when relist is clicked.
 *
 * @returns {HTMLDivElement} Dropdown menu wrapper element.
 */
export default function listingDropdownMenu({
  listing,
  onEdit,
  onDelete,
  onRelist,
}) {
  // Check if listing is still active
  const isActive = new Date(listing.endsAt) > new Date();

  const wrapper = document.createElement('div');
  wrapper.className = 'relative inline-block';

  const button = document.createElement('button');
  button.textContent = '⋯';
  button.setAttribute('aria-label', `Open actions menu for ${listing.title}`);
  button.setAttribute('aria-expanded', 'false');
  button.type = 'button';

  button.className = 'text-text px-2 py-1 text-lg';

  const menu = document.createElement('div');

  menu.className =
    'absolute right-0 top-4 mt-2 bg-card border border-text rounded-lg shadow-md hidden flex flex-col z-50 min-w-[120px]';

  const edit = document.createElement('button');
  edit.textContent = 'Edit';
  edit.type = 'button';
  edit.setAttribute('role', 'menuitem');

  edit.className =
    'px-4 py-2 hover:bg-primary hover:text-gray-500 rounded-md text-text text-left transition-colors';

  const del = document.createElement('button');
  del.textContent = 'Delete';
  del.type = 'button';
  del.setAttribute('role', 'menuitem');

  del.className =
    'px-4 py-2 hover:bg-red-500 text-text rounded-md hover:text-white text-left transition-colors';

  menu.append(edit, del);

  if (!isActive) {
    const relist = document.createElement('button');

    relist.textContent = 'Relist';

    relist.className =
      'px-4 py-2 hover:bg-green-500 rounded-md text-text hover:text-white text-left transition-colors';

    relist.addEventListener('click', () => {
      menu.classList.add('hidden');
      onRelist?.();
    });

    menu.appendChild(relist);
  }

  wrapper.append(button, menu);

  // toggle
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('hidden');
    const isOpen = !menu.classList.contains('hidden');
    button.setAttribute('aria-expanded', isOpen);
  });

  // prevent close
  menu.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // close outside
  document.addEventListener('click', () => {
    menu.classList.add('hidden');
  });

  // edit
  edit.addEventListener('click', () => {
    menu.classList.add('hidden');
    onEdit?.();
  });

  // delete
  del.addEventListener('click', () => {
    menu.classList.add('hidden');
    confirmModal({
      title: 'Delete Listing',
      message: `Are you sure you want to delete "${listing.title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: async () => {
        await onDelete?.();
      },
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      menu.classList.add('hidden');
      button.setAttribute('aria-expanded', 'false');
    }
  });

  return wrapper;
}
