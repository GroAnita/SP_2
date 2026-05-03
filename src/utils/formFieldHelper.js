export function createFormField(labelText, inputElement) {
  const wrapper = document.createElement('div');
  wrapper.className = 'flex flex-col gap-1 w-full';

  const label = document.createElement('label');
  label.className = 'text-sm font-medium text-text';
  label.textContent = labelText;

  const id = labelText.toLowerCase().replace(/\s+/g, '-');
  inputElement.id = id;
  label.setAttribute('for', id);

  wrapper.appendChild(label);
  wrapper.appendChild(inputElement);
  return wrapper;
}
