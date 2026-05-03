import {
  validationFields,
  validateRegisterForm,
  updateFieldState,
  isValidUsername,
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidAddress,
} from '../utils/formValidation.js';
import { registerUser } from '../services/authService.js';
import showToast from '../ui/showToast.js';
import { loginUser } from '../services/authService.js';
import navigate from '../utils/navigate.js';

export default function RegisterUserForm() {
  const container = document.createElement('div');
  container.className =
    'container flex flex-col md:flex-row w-full md:w-2/3 mx-auto';

  const formContainer = document.createElement('div');
  formContainer.className =
    'w-full md:w-2/3 mx-auto p-4 bg-primary rounded-tl-lg rounded-bl-lg shadow-lg flex flex-col gap-6';
  container.appendChild(formContainer);

  const title = document.createElement('h1');
  title.className =
    'text-3xl font-bold mb-4 items-center text-center text-[#1f2937] font-poppins';
  title.textContent = 'Register To bid on LemonBids!';

  const form = document.createElement('form');
  form.className = 'bg-primary text-text p-4 rounded-lg';
  form.autocomplete = 'on';

  const userNameInput = document.createElement('input');
  userNameInput.type = 'text';
  userNameInput.name = 'username';
  userNameInput.placeholder = 'Username';
  userNameInput.className =
    'input border-2 border-yellow-300 w-full mb-4 bg-card active:bg-secondary';
  userNameInput.autocomplete = 'username';

  const addressInput = document.createElement('input');
  addressInput.type = 'text';
  addressInput.name = 'address';
  addressInput.placeholder = 'Address';
  addressInput.className =
    'input border-2 border-primary w-full mb-4 bg-card active:bg-secondary';
  addressInput.autocomplete = 'street-address';

  const phoneInput = document.createElement('input');
  phoneInput.type = 'tel';
  phoneInput.name = 'phone';
  phoneInput.placeholder = 'Phone Number';
  phoneInput.className =
    'input border-2 border-primary w-full mb-4 bg-card active:bg-secondary';
  phoneInput.autocomplete = 'tel';

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.placeholder = 'Email';
  emailInput.className =
    'input border-2 border-primary w-full mb-4 bg-card active:bg-secondary';
  emailInput.autocomplete = 'email';

  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.name = 'password';
  passwordInput.placeholder = 'Password';
  passwordInput.autocomplete = 'new-password';
  passwordInput.className = 'input border-2 border-primary w-full mb-4';

  const passwordConfirmInput = document.createElement('input');
  passwordConfirmInput.type = 'password';
  passwordConfirmInput.name = 'passwordConfirm';
  passwordConfirmInput.placeholder = 'Confirm Password';
  passwordConfirmInput.autocomplete = 'new-password';
  passwordConfirmInput.className = 'input border-2 border-primary w-full mb-4';

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn-primary bg-secondary w-full';
  submitBtn.textContent = 'Register';

  const infoContainer = document.createElement('div');
  infoContainer.className =
    ' text-sm text-center w-full md:w-2/3 text-card flex flex-col bg-[#1f2937] p-4 rounded-tr-lg rounded-br-lg ';

  const infoTitle = document.createElement('h3');
  infoTitle.className =
    'text-3xl font-poppins text-btn-text text-primary font-semibold mb-2';
  infoTitle.textContent = 'Why Register?';

  const inforegister = document.createElement('p');
  inforegister.className = 'text-lg text-left text-primary mb-4';
  inforegister.textContent =
    'Registering an account on LemonBids gives you access to a world of exciting auctions and exclusive listings. Here are some of the benefits you can enjoy:';

  const infoList = document.createElement('ul');
  infoList.className =
    'list-disc list-inside text-left text-primary text-base border-2 border-primary rounded-lg p-4 bg-black/10';
  const benefits = [
    'Access to exclusive listings and auctions.',
    'Ability to place bids and win items.',
    'Receive notifications about new listings and auctions.',
    'Manage your bids and watchlist in one place.',
  ];
  benefits.forEach((benefit) => {
    const li = document.createElement('li');
    li.textContent = benefit;
    infoList.appendChild(li);
  });

  const infoImg = document.createElement('img');
  infoImg.src = `${import.meta.env.BASE_URL}images/Lemonmascot.png`;
  infoImg.alt = 'LemonBids Mascot';
  infoImg.className = 'w-56 h-auto mx-auto mt-4';

  form.appendChild(title);
  const usernameField = validationFields(userNameInput);
  form.appendChild(usernameField.wrapper);
  const addressField = validationFields(addressInput);
  form.appendChild(addressField.wrapper);
  const phoneField = validationFields(phoneInput);
  form.appendChild(phoneField.wrapper);
  const emailField = validationFields(emailInput);
  form.appendChild(emailField.wrapper);
  const passwordField = validationFields(passwordInput);
  form.appendChild(passwordField.wrapper);
  const passwordConfirmField = validationFields(passwordConfirmInput);
  form.appendChild(passwordConfirmField.wrapper);

  form.appendChild(submitBtn);
  formContainer.appendChild(form);

  container.appendChild(formContainer);
  container.appendChild(infoContainer);
  infoContainer.appendChild(infoTitle);
  infoContainer.appendChild(inforegister);
  infoContainer.appendChild(infoList);
  infoContainer.appendChild(infoImg);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('SUBMIT FIRED');
    const formData = {
      username: userNameInput.value.trim(),
      address: addressInput.value.trim(),
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value,
      passwordConfirm: passwordConfirmInput.value,
    };

    console.log('FORM DATA:', formData);

    const result = validateRegisterForm(formData);
    if (!result.valid) {
      showToast(result.message || 'invalid form', 'error');
      return;
    }

    try {
      console.log('CALLING API...');
      await registerUser({
        name: formData.username,
        email: formData.email,
        password: formData.password,
      });
      await loginUser({
        email: formData.email,
        password: formData.password,
      });
      showToast('Registration successful! Welcome to LemonBids.', 'success');
      setTimeout(() => {
        const base = import.meta.env.BASE_URL || '';
        window.history.pushState({}, '', `${base}/profile`);
        document.dispatchEvent(new Event('auth:changed'));
      }, 1500);
    } catch (error) {
      console.error('REGISTER ERROR:', error);

      if (error.message.includes('Profile already exists')) {
        try {
          await loginUser({
            email: formData.email,
            password: formData.password,
          });

          showToast('Welcome back! 🎉 Logging you in...', 'success');

          setTimeout(() => {
            const base = import.meta.env.BASE_URL || '';
            navigate('/profile');
            document.dispatchEvent(new Event('auth:changed'));
          }, 1000);

          return;
        } catch (loginError) {
          showToast(
            'Account exists but login failed. Please log in manually.',
            'error'
          );
          return;
        }
      }

      showToast(error.message || 'Registration failed', 'error');
    }
  });

  userNameInput.addEventListener('input', () => {
    const isValid = isValidUsername(userNameInput.value);
    updateFieldState(
      userNameInput,
      usernameField.icon,
      usernameField.error,
      isValid,
      'Username must be 3-20 characters and can only contain letters, numbers, underscores, or hyphens.'
    );
  });

  emailInput.addEventListener('input', () => {
    const isValid = isValidEmail(emailInput.value);
    updateFieldState(
      emailInput,
      emailField.icon,
      emailField.error,
      isValid,
      'Please enter a valid email address ending with @stud.noroff.no.'
    );
  });

  addressInput.addEventListener('input', () => {
    const isValid = isValidAddress(addressInput.value);
    updateFieldState(
      addressInput,
      addressField.icon,
      addressField.error,
      isValid,
      'Please enter a valid address.'
    );
  });

  phoneInput.addEventListener('input', () => {
    const isValid = isValidPhone(phoneInput.value);
    updateFieldState(
      phoneInput,
      phoneField.icon,
      phoneField.error,
      isValid,
      'Please enter a valid phone number.'
    );
  });

  passwordInput.addEventListener('input', () => {
    const isValid = isValidPassword(passwordInput.value);
    updateFieldState(
      passwordInput,
      passwordField.icon,
      passwordField.error,
      isValid,
      'Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters.'
    );
  });

  passwordConfirmInput.addEventListener('input', () => {
    const isValid =
      passwordConfirmInput.value === passwordInput.value &&
      isValidPassword(passwordConfirmInput.value);
    updateFieldState(
      passwordConfirmInput,
      passwordConfirmField.icon,
      passwordConfirmField.error,
      isValid,
      'Passwords do not match or do not meet the requirements.'
    );
  });

  return container;
}
