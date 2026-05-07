import { createFormField } from '../utils/formFieldHelper.js';
import renderTags from '../ui/renderTags.js';
import showToast from '../ui/showToast.js';
import { createListing } from '../services/createListingService.js';
import {
  createInputWithIcon,
  createTextareaWithIcon,
} from '../utils/createInputWithIcon.js';
import updateListing from '../services/listingFetchService.js';

export default function editOwnListing(listing = null, options = {}) {
  const hasBids = listing?.bids?.length > 0;
  const isRelist = options?.relist;
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
  modalTitle.textContent = isRelist
    ? 'Relist Listing'
    : listing
      ? 'Edit Listing'
      : 'Create New Listing';

  const form = document.createElement('form');
  form.className = 'flex flex-col gap-4';

  const titleField = createInputWithIcon({
    name: 'Title',
    value: listing?.title || '',
    placeholder: 'Listing Title',
  });

  const titleObj = createFormField('Title', titleField);
  form.appendChild(titleObj.wrapper);

  const descriptionField = createTextareaWithIcon({
    name: 'Description',
    value: listing?.description || '',
    placeholder: 'Listing Description',
  });

  const descriptionObj = createFormField('Description', descriptionField);
  form.appendChild(descriptionObj.wrapper);

  const titleInput = titleObj.input;

  const descriptionInput = descriptionObj.input;

  const tags = listing?.tags ? [...listing.tags] : [];

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

  renderTags(tags, tagsWrapper, tagsInput);

  const priceField = createInputWithIcon({
    name: 'Starting Price',
    value: listing?.price || '',
    placeholder: 'Starting Price',
  });

  const tagsObj = createFormField('Tags', tagsWrapper);
  form.appendChild(tagsObj.wrapper);

  const priceObj = createFormField('Starting Price', priceField);
  form.appendChild(priceObj.wrapper);

  const priceInput = priceObj.input;
  priceInput.type = 'number';

  if (hasBids) {
    priceInput.disabled = true;
    priceInput.classList.add('cursor-not-allowed', 'opacity-50');
  }

  const startDateField = createInputWithIcon({
    name: 'Start Date',
    value: listing?.startsAt
      ? new Date(listing.startsAt).toISOString().slice(0, 16)
      : '',
    placeholder: 'Start Date',
  });

  const startDateObj = createFormField('Start Date', startDateField);
  form.appendChild(startDateObj.wrapper);

  const startDateInput = startDateObj.input;
  startDateInput.type = 'datetime-local';

  const endDateField = createInputWithIcon({
    name: 'End Date',
    value: isRelist ? '' : listing?.endsAt,
    placeholder: 'End Date',
  });

  const endDateObj = createFormField('End Date', endDateField);
  form.appendChild(endDateObj.wrapper);

  const endDateInput = endDateObj.input;
  endDateInput.type = 'datetime-local';

  if (hasBids) {
    startDateInput.disabled = true;
    endDateInput.disabled = true;
    startDateInput.classList.add('cursor-not-allowed', 'opacity-50');
    endDateInput.classList.add('cursor-not-allowed', 'opacity-50');
  }

  if (hasBids) {
    const warning = document.createElement('p');
    warning.textContent =
      'You cannot edit the starting price or dates because this listing has active bids.';
    warning.className = 'text-sm text-red-500 mt-2';
    form.appendChild(warning);
  }
  if (isRelist) {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 7);
    endDateInput.value = newDate.toISOString().slice(0, 16);
  }

  const images = listing?.media ? listing.media.map((m) => m.url) : [];

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

  images.forEach((url) => {
    const img = document.createElement('img');
    img.src = url;
    img.className = 'w-full aspect-square object-cover rounded';
    imageGrid.appendChild(img);
  });

  const imageUrlInput = document.createElement('input');
  imageUrlInput.type = 'text';
  imageUrlInput.placeholder = 'Image URL';
  imageUrlInput.className =
    'input w-full border-2 border-gray-300 rounded focus:ring-2 focus:ring-primary';

  const imageUrlObj = createFormField('Image URL', imageUrlInput);
  imageContent.appendChild(imageUrlObj.wrapper);

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
  createButton.textContent = isRelist
    ? 'Relist'
    : listing
      ? 'Update Listing'
      : 'Create Listing';

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

  function validateRequired(input, errorEl, message) {
    if (!input.value.trim()) {
      input.classList.add('border-red-500');
      errorEl.textContent = message;
      errorEl.classList.remove('hidden');
      return false;
    }

    input.classList.remove('border-red-500');
    errorEl.classList.add('hidden');
    return true;
  }

  titleInput.addEventListener('input', () => {
    validateRequired(titleInput, titleObj.error, 'Title is required');
  });

  descriptionInput.addEventListener('input', () => {
    validateRequired(
      descriptionInput,
      descriptionObj.error,
      'Description is required'
    );
  });

  endDateInput.addEventListener('input', () => {
    const valid =
      endDateInput.value && !isNaN(new Date(endDateInput.value).getTime());

    if (!valid) {
      endDateInput.classList.add('border-red-500');
      endDateObj.error.textContent = 'Invalid date';
      endDateObj.error.classList.remove('hidden');
    } else {
      endDateInput.classList.remove('border-red-500');
      endDateObj.error.classList.add('hidden');
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const media = images.map((url) => ({ url }));
    let endsAt = null;
    if (endDateInput.value) {
      const d = new Date(endDateInput.value);
      if (!isNaN(d.getTime())) {
        endsAt = d.toISOString();
      }
    }

    const isValig =
      validateRequired(titleInput, titleObj.error, 'Title is required') &&
      (listing ||
        validateRequired(
          endDateInput,
          endDateObj.error,
          'End date is required'
        ));

    if (!isValig) {
      showToast(
        'Please fix the errors in the form before submitting.',
        'error'
      );
      return;
    }

    if (isRelist) {
      await createListing({
        title,
        description,
        tags,
        media,
        endsAt,
      });
      showToast('Listing relisted successfully!');
      modal.remove();
      document.dispatchEvent(
        new CustomEvent('listing:created', { detail: createListing })
      );
    } else if (listing) {
      const payload = {
        title,
        description,
        tags,
        media,
      };

      if (!hasBids) {
        payload.endsAt = endsAt;
      }
      await updateListing(listing.id, payload);
      showToast('Listing updated successfully!');
      modal.remove();
      document.dispatchEvent(
        new CustomEvent('listing:updated', { detail: listing.id })
      );
    } else {
      await createListing({
        title,
        description,
        tags,
        media,
        endsAt,
      });
      showToast('Listing created successfully!');
      modal.remove();
      document.dispatchEvent(
        new CustomEvent('listing:created', { detail: createListing })
      );
    }
  });
}
