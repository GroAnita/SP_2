/**
 * Validates whether a password meets security requirements.
 *
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 *
 * @param {string} password - Password to validate.
 * @returns {boolean} True if password is valid.
 */
export function isValidPassword(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  );
}

/**
 * Validates a phone number.
 *
 * Supports:
 * - Optional leading +
 * - Numbers
 * - Spaces
 * - Hyphens
 *
 * @param {string} phone - Phone number to validate.
 * @returns {boolean} True if phone number is valid.
 */
export function isValidPhone(phone) {
  const phoneRegex = /^\+?[\d\s-]{7,15}$/;
  return phoneRegex.test(phone.trim());
}

/**
 * Validates an address field.
 *
 * Checks that the address is not empty.
 *
 * @param {string} address - Address to validate.
 * @returns {boolean} True if address is valid.
 */
export function isValidAddress(address) {
  return address.trim().length > 0;
}

/**
 * Validates a username.
 *
 * Requirements:
 * - 3–20 characters
 * - Letters
 * - Numbers
 * - Underscores
 * - Hyphens
 *
 * @param {string} name - Username to validate.
 * @returns {boolean} True if username is valid.
 */
export function isValidUsername(name) {
  const nameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return nameRegex.test(name.trim());
}

/**
 * Validates a Noroff student email address.
 *
 * Requirements:
 * - Valid email format
 * - Must end with @stud.noroff.no
 *
 * @param {string} email - Email address to validate.
 * @returns {boolean} True if email is valid.
 */
export function isValidEmail(email) {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (
    emailRegex.test(email) && email.toLowerCase().endsWith('@stud.noroff.no')
  );
}

/**
 * Validates registration form data.
 *
 * Checks:
 * - Username validity
 * - Email validity
 * - Password validity
 *
 * Returns the first validation error encountered.
 *
 * @param {Object} data - Registration form data.
 * @param {string} data.username - Username value.
 * @param {string} data.email - Email value.
 * @param {string} data.password - Password value.
 *
 * @returns {{
 *   valid: boolean,
 *   message?: string
 * }}
 * Validation result object.
 */
export function validateRegisterForm(data) {
  if (!isValidUsername(data.username)) {
    return {
      valid: false,
      message:
        'Username must be 3-20 characters and can only contain letters, numbers, underscores, or hyphens.',
    };
  }
  if (!isValidEmail(data.email)) {
    return {
      valid: false,
      message:
        'Please enter a valid email address ending with @stud.noroff.no.',
    };
  }
  if (!isValidPassword(data.password)) {
    return {
      valid: false,
      message:
        'Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters.',
    };
  }
  return { valid: true };
}

/**
 * Enhances a field with:
 * - Validation state icon
 * - Error message element
 *
 * Used for real-time form validation feedback.
 *
 * @param {Object} field - Field object from input factory.
 * @param {HTMLDivElement} field.wrapper - Field wrapper element.
 * @param {HTMLInputElement|HTMLTextAreaElement} field.input - Field element.
 *
 * @returns {{
 *   wrapper: HTMLDivElement,
 *   input: HTMLInputElement|HTMLTextAreaElement,
 *   icon: HTMLSpanElement,
 *   error: HTMLParagraphElement
 * }}
 * Enhanced validation field object.
 */
export function validationFields(field) {
  const { wrapper, input } = field;

  wrapper.classList.add('flex', 'flex-col');
  const icon = document.createElement('span');
  icon.className =
    'absolute right-2 top-1/3 transform -translate-y-1/2 text-xl pointer-events-none';

  const error = document.createElement('p');
  error.className = 'text-red-500 text-sm mt-1 hidden';

  wrapper.appendChild(icon);
  wrapper.appendChild(error);

  return { wrapper, input, icon, error };
}

/**
 * Updates the visual validation state of a form field.
 *
 * Handles:
 * - Border colors
 * - Validation icons
 * - Error messages
 *
 * @param {HTMLInputElement|HTMLTextAreaElement} input - Field element.
 * @param {HTMLSpanElement} icon - Validation icon element.
 * @param {HTMLParagraphElement} errorEl - Error message element.
 * @param {boolean} isValid - Validation state.
 * @param {string} [message=''] - Error message text.
 *
 * @returns {void}
 */
export function updateFieldState(input, icon, errorEl, isValid, message = '') {
  input.classList.remove('border-red-500', 'border-green-500');

  if (input.value === '') {
    icon.textContent = '';
    errorEl.textContent = '';
    errorEl.classList.add('hidden');
    return;
  }

  if (isValid) {
    input.classList.add('border-green-500');
    icon.textContent = '✓';
    icon.classList.remove('text-red-500');
    icon.classList.add('text-green-500');

    errorEl.textContent = '';
    errorEl.classList.add('hidden');
  } else {
    input.classList.add('border-red-500');
    icon.textContent = '✗';
    icon.classList.remove('text-green-500');
    icon.classList.add('text-red-500');

    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
  }
}
