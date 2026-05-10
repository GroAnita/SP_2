export default function listingDropdownMenu({
  listing,
  onEdit,
  onDelete,
  onRelist,
}) {
  const isActive = new Date(listing.endsAt) > new Date();

  const wrapper = document.createElement('div');
  wrapper.className = 'relative inline-block';

  const button = document.createElement('button');
  button.textContent = '⋯';

  button.className = 'text-text px-2 py-1 text-lg';

  const menu = document.createElement('div');

  menu.className =
    'absolute right-0 top-4 mt-2 bg-card border border-text rounded-lg shadow-md hidden flex flex-col z-50 min-w-[120px]';

  const edit = document.createElement('button');
  edit.textContent = 'Edit';

  edit.className =
    'px-4 py-2 hover:bg-primary hover:text-gray-500 rounded-md text-text text-left transition-colors';

  const del = document.createElement('button');
  del.textContent = 'Delete';

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
    onDelete?.();
  });

  return wrapper;
}
