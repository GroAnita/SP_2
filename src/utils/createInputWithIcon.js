/**
 * Creates a text input field with a clickable pen icon.
 *
 * @param {Object} options - Input configuration options.
 * @param {string} options.id - Unique input ID.
 * @param {string} options.name - Input name attribute.
 * @param {string} options.label - Accessible label text.
 * @param {string} [options.type='text'] - Input type.
 * @param {string} [options.value=''] - Default input value.
 * @param {string} [options.placeholder=''] - Input placeholder text.
 *
 * @returns {{wrapper: HTMLDivElement, input: HTMLInputElement}}
 * Returns the wrapper element and input element.
 */
export function createInputWithIcon({
  id,
  name,
  label,
  type = 'text',
  value = '',
  placeholder = '',
}) {
  const wrapper = document.createElement('div');
  wrapper.className = 'input-wrapper relative w-full';

  const inputLabel = document.createElement('label');
  inputLabel.textContent = label;
  inputLabel.className = 'sr-only';
  inputLabel.htmlFor = id;

  const input = document.createElement('input');
  input.type = type;
  input.name = name;
  input.id = id;
  input.value = value;
  input.placeholder = placeholder;
  input.className = 'input w-full mb-4 pr-10';

  const icon = document.createElement('i');
  icon.className =
    'fa-solid fa-pen absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-primary transition';

  icon.addEventListener('click', () => input.focus());

  wrapper.appendChild(inputLabel);
  wrapper.appendChild(input);
  wrapper.appendChild(icon);

  return { wrapper, input };
}

/**
 * Creates a textarea field with a clickable pen icon.
 *
 * @param {Object} options - Textarea configuration options.
 * @param {string} options.id - Unique textarea ID.
 * @param {string} options.name - Textarea name attribute.
 * @param {string} options.label - Accessible label text.
 * @param {string} [options.value=''] - Default textarea value.
 * @param {string} [options.placeholder=''] - Textarea placeholder text.
 *
 * @returns {{wrapper: HTMLDivElement, input: HTMLTextAreaElement}}
 * Returns the wrapper element and textarea element.
 */
export function createTextareaWithIcon({
  id,
  name,
  label,
  value = '',
  placeholder = '',
}) {
  const wrapper = document.createElement('div');
  wrapper.className = 'input-wrapper relative w-full';

  const textareaLabel = document.createElement('label');
  textareaLabel.textContent = label;
  textareaLabel.className = 'sr-only';
  textareaLabel.htmlFor = id;

  const textarea = document.createElement('textarea');
  textarea.name = name;
  textarea.value = value;
  textarea.id = id;
  textarea.placeholder = placeholder;
  textarea.className = 'input w-full mb-4 pr-10';

  const icon = document.createElement('i');
  icon.className =
    'fa-solid fa-pen absolute right-3 top-3 text-gray-400 cursor-pointer hover:text-primary';

  icon.addEventListener('click', () => textarea.focus());

  wrapper.appendChild(textareaLabel);
  wrapper.appendChild(textarea);
  wrapper.appendChild(icon);

  return { wrapper, input: textarea };
}

/**
 * Creates a password input field with a toggle visibility button.
 *
 * Features:
 * - Toggle between hidden and visible password
 * - Accessible toggle button
 * - Dynamic eye / eye-slash icon
 *
 * @param {Object} options - Password field configuration.
 * @param {string} options.id - Unique input ID.
 * @param {string} options.name - Input name attribute.
 * @param {string} options.label - Accessible label text.
 * @param {string} [options.value=''] - Default password value.
 * @param {string} [options.placeholder=''] - Input placeholder text.
 * @param {string} [options.autocomplete=''] - Autocomplete value.
 *
 * @returns {{wrapper: HTMLDivElement, input: HTMLInputElement}}
 * Returns the wrapper element and password input element.
 */
export function createPasswordInputWithIcon({
  id,
  name,
  label,
  value = '',
  placeholder = '',
  autocomplete = '',
}) {
  const wrapper = document.createElement('div');
  wrapper.className = 'input-wrapper relative w-full';

  const inputLabel = document.createElement('label');
  inputLabel.textContent = label;
  inputLabel.className = 'sr-only';
  inputLabel.htmlFor = id;

  const input = document.createElement('input');
  input.type = 'password';
  input.name = name;
  input.id = id;
  input.value = value;
  input.placeholder = placeholder;
  input.autocomplete = autocomplete;
  input.className = 'input w-full mb-4 pr-10';

  const toggleBtn = document.createElement('button');
  toggleBtn.type = 'button';

  toggleBtn.className =
    'absolute right-6 top-1/3 -translate-y-1/2 text-gray-800 hover:text-primary transition';

  toggleBtn.setAttribute('aria-label', 'Show password');

  toggleBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';

  toggleBtn.addEventListener('click', () => {
    const isPassword = input.type === 'password';

    input.type = isPassword ? 'text' : 'password';

    toggleBtn.innerHTML = isPassword
      ? '<i class="fa-solid fa-eye-slash"></i>'
      : '<i class="fa-solid fa-eye"></i>';

    toggleBtn.setAttribute(
      'aria-label',
      isPassword ? 'Hide password' : 'Show password'
    );
  });

  wrapper.appendChild(inputLabel);
  wrapper.appendChild(input);
  wrapper.appendChild(toggleBtn);

  return { wrapper, input };
}

/**
 * Creates a reusable input or textarea field.
 *
 * Supports:
 * - Standard inputs
 * - Textareas
 * - Optional pen icon
 * - Custom autocomplete values
 *
 * @param {Object} options - Field configuration options.
 * @param {string} [options.type='text'] - Field type.
 * @param {string} options.name - Field name attribute.
 * @param {string} options.id - Unique field ID.
 * @param {string} [options.value=''] - Default field value.
 * @param {string} [options.placeholder=''] - Placeholder text.
 * @param {boolean} [options.icon=false] - Whether to show a pen icon.
 * @param {string} [options.autocomplete=''] - Autocomplete value.
 *
 * @returns {{wrapper: HTMLDivElement, input: HTMLInputElement|HTMLTextAreaElement}}
 * Returns the wrapper element and created field element.
 */
export function createInputField({
  type = 'text',
  name,
  id,
  value = '',
  placeholder = '',
  icon = false,
  autocomplete = '',
}) {
  const wrapper = document.createElement('div');
  wrapper.className = 'input-wrapper mb-4 relative w-full';

  const input =
    type === 'textarea'
      ? document.createElement('textarea')
      : document.createElement('input');

  if (type !== 'textarea') {
    input.type = type;
  }

  input.name = name;
  input.id = id;
  input.value = value;
  input.placeholder = placeholder;
  input.className = 'input w-full';
  input.autocomplete = autocomplete;

  wrapper.appendChild(input);

  if (icon) {
    input.classList.add('pr-10');

    const iconEl = document.createElement('i');
    iconEl.className =
      'fa-solid fa-pen absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-primary transition';

    iconEl.addEventListener('click', () => input.focus());

    wrapper.appendChild(iconEl);
  }

  return {
    wrapper,
    input,
  };
}
