export function isValidPassword(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  );
}

export function isValidPhone(phone) {
  const phoneRegex = /^\+?[\d\s-]{7,15}$/;
  return phoneRegex.test(phone.trim());
}

export function isValidAddress(address) {
  return address.trim().length > 0;
}

export function isValidUsername(name) {
  const nameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return nameRegex.test(name.trim());
}

export function isValidEmail(email) {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (
    emailRegex.test(email) && email.toLowerCase().endsWith('@stud.noroff.no')
  );
}

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

export function validationFields(input) {
  const wrapper = document.createElement('div');
  wrapper.className = 'relative w-full mb-2 flex flex-col';

  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'relative w-full';

  const icon = document.createElement('span');
  icon.className =
    'absolute right-3 top-1/2 transform -translate-y-1/2 text-xl pointer-events-none';

  const error = document.createElement('p');
  error.className = 'text-red-500 text-sm mt-1 hidden';

  inputWrapper.appendChild(input);
  inputWrapper.appendChild(icon);
  wrapper.appendChild(inputWrapper);
  wrapper.appendChild(error);

  return { wrapper, icon, error };
}

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
