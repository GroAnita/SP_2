import { setupEscapeClose } from '../utils/modalUtils';
import { closeModal } from '../utils/modalUtils.js';

/**
 * Creates and shows a reusable confirmation modal.
 *
 * Features:
 * - Accessible modal dialog
 * - Keyboard support (Escape to close)
 * - Click outside to close
 * - Custom title, message, and button text
 * - Async confirmation handling
 * - Automatic focus management
 *
 * Used for confirming destructive or important actions
 * such as deleting listings or removing data.
 *
 * @function confirmModal
 *
 * @param {Object} options - Modal configuration options
 * @param {string} [options.title='Confirm Action']
 * Modal title text
 *
 * @param {string} [options.message='Are you sure?']
 * Modal message/body text
 *
 * @param {string} [options.confirmText='Confirm']
 * Text displayed on the confirm button
 *
 * @param {string} [options.cancelText='Cancel']
 * Text displayed on the cancel button
 *
 * @param {Function} [options.onConfirm]
 * Async or sync callback triggered when the user confirms
 *
 * @returns {void}
 *
 * @example
 * confirmModal({
 *   title: 'Delete Listing',
 *   message: 'Are you sure you want to delete this listing?',
 *   confirmText: 'Delete',
 *   cancelText: 'Keep Listing',
 *   onConfirm: async () => {
 *     await deleteListing(id);
 *   },
 * });
 */
export default function confirmModal({
  title = 'Confirm Action',
  message = 'Are you sure?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
}) {
  const modal = document.createElement('div');
  modal.className =
    'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'confirm-modal-title');
  modal.setAttribute('aria-describedby', 'confirm-modal-message');

  const modalContent = document.createElement('div');
  modalContent.className =
    'bg-card rounded-lg p-6 w-full text-text max-w-sm relative';

  const closeButton = document.createElement('button');
  closeButton.className =
    'absolute top-2 right-2 text-gray-500 text-xl hover:text-gray-700 dark:hover:text-gray-300';
  closeButton.innerHTML = '&times;';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Close confirmation dialog');
  closeButton.addEventListener('click', () => {
    closeModal(modal);
  });

  const titleElem = document.createElement('h2');
  titleElem.className = 'text-2xl font-bold mb-4';
  titleElem.textContent = title;
  titleElem.id = 'confirm-modal-title';

  const messageElem = document.createElement('p');
  messageElem.className = 'mb-6';
  messageElem.textContent = message;
  messageElem.id = 'confirm-modal-message';

  const buttonsWrapper = document.createElement('div');
  buttonsWrapper.className = 'flex justify-end gap-4';

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.className =
    'bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition';
  cancelButton.textContent = cancelText;
  cancelButton.addEventListener('click', () => {
    closeModal(modal);
  });

  const confirmButton = document.createElement('button');
  confirmButton.type = 'button';
  confirmButton.className =
    'bg-error text-white px-4 py-2 rounded hover:bg-primary-dark transition';
  confirmButton.textContent = confirmText;
  confirmButton.addEventListener('click', async () => {
    await onConfirm?.();
    closeModal(modal);
  });

  setupEscapeClose(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });

  requestAnimationFrame(() => {
    confirmButton.focus();
  });

  buttonsWrapper.append(cancelButton, confirmButton);
  modalContent.append(closeButton, titleElem, messageElem, buttonsWrapper);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}
