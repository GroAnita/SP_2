/**
 * Closes and removes a modal from the DOM.
 *
 * If a container element is provided, a slide-out animation
 * is triggered before removing the modal.
 *
 * @param {HTMLElement} modal - Modal overlay element to remove.
 * @param {HTMLElement|null} [container=null] - Optional animated container element.
 *
 * @returns {void}
 */
export function closeModal(modal, container = null) {
  if (container) {
    container.classList.add('translate-x-full');

    setTimeout(() => {
      modal.remove();
    }, 300);

    return;
  }

  modal.remove();
}

/**
 * So that ESC can be used for closing a modal.
 *
 * Automatically removes the keydown listener
 * after the modal is closed.
 *
 * @param {HTMLElement} modal - Modal overlay element.
 * @param {HTMLElement|null} [container=null] - Optional animated container element.
 *
 * @returns {(e: KeyboardEvent) => void}
 * Returns the Escape key event handler.
 */
export function setupEscapeClose(modal, container = null) {
  function handleEscape(e) {
    if (e.key === 'Escape') {
      closeModal(modal, container);

      document.removeEventListener('keydown', handleEscape);
    }
  }

  document.addEventListener('keydown', handleEscape);

  return handleEscape;
}
