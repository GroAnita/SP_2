export function createFormField(labelText, fieldEl) {
  const wrapper = document.createElement('div');
  wrapper.className = 'flex flex-col gap-1 w-full';

  const label = document.createElement('label');
  label.className = 'text-sm font-medium text-text';
  label.textContent = labelText;

  const error = document.createElement('p');
  error.className = 'text-sm text-red-500 mt-1 hidden';

  // generate id
  const id = labelText.toLowerCase().replace(/\s+/g, '-');

  const input = fieldEl.querySelector('input, textarea');

  if (input) {
    input.id = id;
    label.setAttribute('for', id);
  }

  wrapper.appendChild(label);
  wrapper.appendChild(fieldEl);
  wrapper.appendChild(error);

  return {
    wrapper,
    input,
    error,
  };
}
