import { createFormField } from '../utils/formFieldHelper.js';
import renderTags from '../ui/renderTags.js';
import showToast from '../ui/showToast.js';
import { createListing } from '../services/createListingService.js';

export default function CreateNewListing() {
  const modal = document.createElement('div');
  modal.className =
    'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 w-full overflow-y-auto';

  const contentWrapper = document.createElement('div');
  contentWrapper.className =
    'flex flex-col md:flex-row items-start justify-center w-full max-w-4xl p-6 bg-card rounded-lg max-h-[90vh] overflow-y-auto ';

  const modalContent = document.createElement('div');
  modalContent.className =
    'bg-card rounded-lg p-6 w-full md:w-1/2 flex-1 relative';

  const imageContent = document.createElement('div');
  imageContent.className =
    'flex flex-col items-start justify-start w-full md:w-1/2 p-6 bg-card rounded-lg relative flex-1 mt-4';

  const modalTitle = document.createElement('h2');
  modalTitle.className = 'text-2xl font-bold mb-4';
  modalTitle.textContent = 'Create New Listing';

  const form = document.createElement('form');
  form.className = 'flex flex-col gap-4';

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.placeholder = 'Listing Title';
  titleInput.className =
    'input w-full border-2 border-gray-300 rounded focus:ring-2 focus:ring-primary';

  const descriptionInput = document.createElement('textarea');
  descriptionInput.placeholder = 'Listing Description';
  descriptionInput.className =
    'input w-full border-2 border-gray-300 rounded focus:ring-2 focus:ring-primary';

  const tags = [];

  const tagsWrapper = document.createElement('div');
  tagsWrapper.className =
    'flex flex-wrap gap-2 p-2 border rounded bg-card border-gray-300 focus-within:ring-2 focus-within:ring-primary';

  const tagsInput = document.createElement('input');
  tagsInput.placeholder = 'Add tags...';
  tagsInput.className = 'flex-1 outline-none bg-transparent';

  tagsWrapper.appendChild(tagsInput);

  tagsInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && tagsInput.value.trim()) {
      e.preventDefault();
      const value = tagsInput.value.trim();
      if (tags.length >= 8) return;
      if (tags.includes(value)) {
        showToast('Tag already added');
        return;
      }

      if (value.length > 20) return;
      if (!value) return;
      tags.push(value);
      renderTags(tags, tagsWrapper, tagsInput);
      tagsInput.value = '';
    }
  });
  const priceInput = document.createElement('input');
  priceInput.type = 'number';
  priceInput.placeholder = 'Starting Price';
  priceInput.className =
    'input w-full border-2 border-gray-300 rounded focus:ring-2 focus:ring-primary';

  const startDateInput = document.createElement('input');
  startDateInput.type = 'datetime-local';
  startDateInput.placeholder = 'Start Date';
  startDateInput.className =
    'input w-full border-2 border-gray-300 rounded focus:ring-2 focus:ring-primary';

  const endDateInput = document.createElement('input');
  endDateInput.type = 'datetime-local';
  endDateInput.placeholder = 'End Date';
  endDateInput.className =
    'input w-full border-2 border-gray-300 rounded focus:ring-2 focus:ring-primary';

  const images = [];

  const addImageButton = document.createElement('button');
  addImageButton.type = 'button';
  addImageButton.className =
    'bg-primary text-text px-4 py-2 rounded-full border-2 border-text mt-2 hover:bg-secondary transition';
  addImageButton.textContent = 'Add Image';

  const imageGrid = document.createElement('div');
  imageGrid.className = 'grid grid-cols-4 gap-2 mt-2 w-full';

  addImageButton.addEventListener('click', () => {
    const url = imageUrlInput.value.trim();
    if (!url) return;
    if (images.length >= 8) {
      alert('You can only add up to 8 images.');
      return;
    }
    images.push(url);
    const img = document.createElement('img');
    img.src = url;
    img.className = 'w-full aspect-square object-cover rounded';
    imageGrid.appendChild(img);
    imageUrlInput.value = '';
  });

  const imageUrlInput = document.createElement('input');
  imageUrlInput.type = 'text';
  imageUrlInput.placeholder = 'Image URL';
  imageUrlInput.className =
    'input w-full border-2 border-gray-300 rounded focus:ring-2 focus:ring-primary';

  const closeButton = document.createElement('button');
  closeButton.className =
    'absolute top-2 right-2 text-gray-500 hover:text-gray-700';
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', () => {
    modal.remove();
  });

  const createButtonWrapper = document.createElement('div');
  createButtonWrapper.className = 'w-full flex justify-end';

  const actionBtnWrapper = document.createElement('div');
  actionBtnWrapper.className = 'w-full flex justify-end gap-2';

  const createButton = document.createElement('button');
  createButton.type = 'submit';
  createButton.className =
    'bg-primary text-text px-4 py-2 border-2 border-text rounded-full hover:bg-primary-dark transition mt-4 hover:bg-secondary';
  createButton.textContent = 'Create Listing';

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.className =
    'bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition mt-4 mr-2';
  cancelButton.textContent = 'Cancel';
  cancelButton.addEventListener('click', () => {
    modal.remove();
  });
  modalContent.appendChild(modalTitle);
  imageContent.appendChild(closeButton);
  modalContent.appendChild(form);
  form.appendChild(createFormField('Title', titleInput));
  form.appendChild(createFormField('Description', descriptionInput));
  form.appendChild(createFormField('Tags', tagsWrapper));
  form.appendChild(createFormField('Starting Price', priceInput));
  form.appendChild(createFormField('Start Date', startDateInput));
  form.appendChild(createFormField('End Date', endDateInput));
  imageContent.appendChild(createFormField('Image URL', imageUrlInput));
  createButtonWrapper.appendChild(addImageButton);
  form.appendChild(imageContent);
  imageContent.appendChild(imageGrid);

  imageContent.appendChild(createButtonWrapper);
  form.appendChild(actionBtnWrapper);
  actionBtnWrapper.appendChild(cancelButton);
  actionBtnWrapper.appendChild(createButton);
  contentWrapper.appendChild(modalContent);

  modalContent.appendChild(form);

  modal.appendChild(contentWrapper);

  document.body.appendChild(modal);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('SUBMIT FIRED');
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const endDate = new Date(endDateInput.value);
    const media = images.map((url) => ({ url }));

    const endsAt = endDate.toISOString();

    if (!title || isNaN(endDate.getTime())) {
      showToast('Title and end date are required');
      return;
    }

    try {
      const newListing = await createListing({
        title,
        description,
        tags,
        media,
        endsAt,
      });
      showToast('Listing created successfully');
      modal.remove();
      document.dispatchEvent(
        new CustomEvent('listing:created', { detail: newListing })
      );
    } catch (error) {
      showToast(error.message || 'Failed to create listing');
    }
  });
}
