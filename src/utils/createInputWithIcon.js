export function createInputWithIcon({ name, value = '', placeholder = '' }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'input-wrapper relative w-full';

  const input = document.createElement('input');
  input.type = 'text';
  input.name = name;
  input.value = value;
  input.placeholder = placeholder;
  input.className = 'input w-full pr-10';

  const icon = document.createElement('i');
  icon.className =
    'fa-solid fa-pen absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-primary transition';

  icon.addEventListener('click', () => input.focus());

  wrapper.appendChild(input);
  wrapper.appendChild(icon);

  return wrapper;
}

export function createTextareaWithIcon({ name, value = '', placeholder = '' }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'input-wrapper relative w-full';

  const textarea = document.createElement('textarea');
  textarea.name = name;
  textarea.value = value;
  textarea.placeholder = placeholder;
  textarea.className = 'input w-full pr-10';

  const icon = document.createElement('i');
  icon.className =
    'fa-solid fa-pen absolute right-3 top-3 text-gray-400 cursor-pointer hover:text-primary';

  icon.addEventListener('click', () => textarea.focus());

  wrapper.appendChild(textarea);
  wrapper.appendChild(icon);

  return wrapper;
}
