export function createFormField(labelText, field) {
  const wrapper = document.createElement('div');
  wrapper.className = 'flex flex-col gap-1 w-full';

  const label = document.createElement('label');
  label.className = 'text-sm font-medium text-text';
  label.textContent = labelText;

  const error = document.createElement('p');
  error.className = 'text-sm text-red-500 mt-1 hidden';

  // generate id
  const id = labelText.toLowerCase().replace(/\s+/g, '-');

  field.input.id = id;
  label.setAttribute('for', id);

  wrapper.appendChild(label);
  wrapper.appendChild(field.wrapper);
  wrapper.appendChild(error);

  return {
    wrapper,
    input: field.input,
    error,
  };
}
