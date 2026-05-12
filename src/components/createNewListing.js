import { createFormField } from '../utils/formFieldHelper.js';
import renderTags from '../ui/renderTags.js';
import showToast from '../ui/showToast.js';
import { createListing } from '../services/createListingService.js';
import optimizeImageUrl from '../utils/optimizeImageUrl.js';
import { closeModal, setupEscapeClose } from '../utils/modalUtils.js';
import { createInputField } from '../utils/createInputWithIcon.js';

/**
 * Creates and renders the "Create New Listing" modal.
 *
 * This modal allows users to:
 * - Add a title and description
 * - Add tags
 * - Set auction dates
 * - Upload image URLs with previews
 * - Submit a new listing to the API
 *
 * Features:
 * - Accessible modal behavior
 * - Escape key support
 * - Click outside to close
 * - Dynamic image preview grid
 * - Tag management
 * - Toast notifications
 * - Form validation
 *
 * Dependencies:
 * - createFormField
 * - createInputField
 * - renderTags
 * - createListing
 * - optimizeImageUrl
 * - closeModal
 * - setupEscapeClose
 *
 * @returns {void}
 */
export default function CreateNewListing() {
  const modal = document.createElement('div');
  modal.className =
    'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 w-full overflow-y-auto';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'create-listing-title');

  const contentWrapper = document.createElement('div');
  contentWrapper.className =
    'flex flex-col md:flex-row items-start justify-center w-full max-w-4xl p-6 bg-card rounded-lg max-h-[90vh] overflow-y-auto ';

  const modalContent = document.createElement('section');
  modalContent.className =
    'bg-card rounded-lg p-6 w-full md:w-1/2 flex-1 relative';

  const imageContent = document.createElement('div');
  imageContent.className =
    'flex flex-col items-start justify-start w-full md:w-1/2 p-6 bg-card rounded-lg relative flex-1 mt-4';

  const modalTitle = document.createElement('h2');
  modalTitle.className = 'text-2xl text-text font-bold mb-4';
  modalTitle.textContent = 'Create New Listing';
  modalTitle.id = 'create-listing-title';

  const form = document.createElement('form');
  form.className = 'flex flex-col gap-4';

  const titleField = createInputField({
    id: 'listing-title',
    name: 'listing-title',
    label: 'Title',
    placeholder: 'Listing Title',
  });

  const titleObj = createFormField('Title', titleField);
  const titleInput = titleObj.input;

  form.appendChild(titleObj.wrapper);

  const descriptionField = createInputField({
    type: 'textarea',
    id: 'listing-description',
    name: 'listing-description',
    label: 'Description',
    placeholder: 'Listing Description',
  });

  const descriptionObj = createFormField('Description', descriptionField);
  form.appendChild(descriptionObj.wrapper);
  const descriptionInput = descriptionObj.input;

  /**
   * Stores all tags added to the listing.
   * @type {string[]}
   */
  const tags = [];

  const tagsSection = document.createElement('div');

  const tagsLabel = document.createElement('label');
  tagsLabel.textContent = 'Tags';
  tagsSection.className = 'flex flex-col gap-1';

  const tagsWrapper = document.createElement('div');
  tagsWrapper.className =
    'flex flex-wrap gap-2 p-2 border rounded bg-card border-gray-300 focus-within:ring-2 focus-within:ring-primary';

  tagsSection.appendChild(tagsLabel);
  tagsSection.appendChild(tagsWrapper);
  form.appendChild(tagsSection);
  const tagsInput = document.createElement('input');
  tagsInput.placeholder = 'Add tags...';
  tagsInput.className = 'flex-1 outline-none bg-transparent';
  tagsInput.id = 'listing-tags';
  tagsInput.setAttribute('aria-label', 'Add tags');
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

  const priceField = createInputField({
    id: 'listing-price',
    name: 'listing-price',
    label: 'Starting Price',
    placeholder: 'Starting Price',
  });

  const priceObj = createFormField('Starting Price', priceField);
  form.appendChild(priceObj.wrapper);
  const priceInput = priceObj.input;

  const startDateField = createInputField({
    type: 'datetime-local',
    id: 'listing-start-date',
    name: 'listing-start-date',
    label: 'Start Date',
    placeholder: 'Start Date',
  });

  const startDateObj = createFormField('Start Date', startDateField);
  form.appendChild(startDateObj.wrapper);
  const startDateInput = startDateObj.input;

  const endDateField = createInputField({
    type: 'datetime-local',
    id: 'listing-end-date',
    name: 'listing-end-date',
    label: 'End Date',
    placeholder: 'End Date',
  });

  const endDateObj = createFormField('End Date', endDateField);
  form.appendChild(endDateObj.wrapper);
  const endDateInput = endDateObj.input;

  /**
   * Stores all image URLs added to the listing.
   * @type {string[]}
   */
  const images = [];

  /**
   * Handles adding image previews to the image grid.
   */
  const addImageButton = document.createElement('button');
  addImageButton.type = 'button';
  addImageButton.className =
    'bg-primary text-gray-800 px-4 py-2 rounded-full border-2 border-text mt-2 hover:bg-secondary transition';
  addImageButton.textContent = 'Add Image';

  const imageGrid = document.createElement('div');
  imageGrid.className = 'grid grid-cols-4 gap-2 mt-2 w-full';

  addImageButton.addEventListener('click', () => {
    const url = imageUrlInput.value.trim();
    if (!url) return;
    if (images.length >= 8) {
      showToast('You can only add up to 8 images.', 'warning');
      return;
    }
    images.push(url);

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'relative';

    const img = document.createElement('img');
    img.src = optimizeImageUrl(url, 300);
    img.alt = 'Listing preview Image';

    img.className = 'w-full aspect-square object-cover rounded';

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.setAttribute('aria-label', 'Remove image');
    removeBtn.innerHTML = '&times;';
    removeBtn.className =
      'absolute top-1 right-1 bg-black/70 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-500 transition';

    removeBtn.addEventListener('click', () => {
      // remove image from array
      const index = images.indexOf(url);

      if (index > -1) {
        images.splice(index, 1);
      }

      // remove from UI
      imageWrapper.remove();
    });

    imageWrapper.appendChild(img);
    imageWrapper.appendChild(removeBtn);

    imageGrid.appendChild(imageWrapper);
  });

  const imageUrlField = createInputField({
    id: 'listing-image-url',
    name: 'image-url',
    placeholder: 'Image URL',
  });

  const imageUrlObj = createFormField('Image URL', imageUrlField);

  const imageUrlInput = imageUrlObj.input;

  const closeButton = document.createElement('button');
  closeButton.className =
    'absolute text-2xl top-2 right-2 text-gray-500 hover:text-secondary';
  closeButton.setAttribute('aria-label', 'Close create listing form');
  closeButton.type = 'button';
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', () => {
    closeModal(modal);
  });

  const createButtonWrapper = document.createElement('div');
  createButtonWrapper.className = 'w-full flex justify-end';

  const actionBtnWrapper = document.createElement('div');
  actionBtnWrapper.className = 'w-full flex justify-end gap-2';

  const createButton = document.createElement('button');
  createButton.type = 'submit';
  createButton.className =
    'bg-primary text-gray-800 px-4 py-2 border-2 border-text rounded-full hover:bg-primary-dark transition mt-4 hover:bg-secondary';
  createButton.textContent = 'Create Listing';

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.className =
    'bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition mt-4 mr-2';
  cancelButton.textContent = 'Cancel';
  cancelButton.addEventListener('click', () => {
    closeModal(modal);
  });

  modalContent.appendChild(modalTitle);
  modalContent.appendChild(closeButton);

  imageContent.appendChild(imageUrlObj.wrapper);
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

  requestAnimationFrame(() => {
    titleInput.focus();
  });

  /**
   * Handling listing creation form submissions.
   *
   * Validates the required fields,
   * transforms image URLs into media objects,
   * and sends the listing payload to the API.
   */
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

    if (!title || !endsAt) {
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
      closeModal(modal);
      document.dispatchEvent(
        new CustomEvent('listing:created', { detail: newListing })
      );
    } catch (error) {
      showToast(error.message || 'Failed to create listing');
    }
  });
  setupEscapeClose(modal);
  /**
   * Closes modal when clicking outside the modal content.
   */
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
}
