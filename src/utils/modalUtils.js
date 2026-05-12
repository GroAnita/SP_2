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
