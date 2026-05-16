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
import {
  createInputField,
  createPasswordInputWithIcon,
} from '../utils/createInputWithIcon.js';

/**
 * This creates the LemonBids registration form .
 *
 * Features:
 * - Username, address, phone, email, and password fields
 * - Live form validation with error states
 * - Password visibility toggle support
 * - User registration and automatic login
 * - Toast notifications for success/error states
 * - SPA navigation after successful registration
 * - Responsive two-column layout with info section
 *
 * Validation includes:
 * - Username validation
 * - Noroff student email validation
 * - Password strength validation
 * - Phone and address validation
 * - Password confirmation matching
 *
 * Dependencies:
 * - validationFields()
 * - validateRegisterForm()
 * - updateFieldState()
 * - registerUser()
 * - loginUser()
 * - showToast()
 * - navigate()
 * - createInputField()
 * - createPasswordInputWithIcon()
 *
 * @function RegisterUserForm
 *
 * @returns {HTMLElement}
 * Fully constructed registration page container.
 *
 * @example
 * const registerView = RegisterUserForm();
 * app.appendChild(registerView);
 */
export default function RegisterUserForm() {
  const container = document.createElement('main');
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

  const usernameFieldInput = validationFields(
    createInputField({
      id: 'username',
      name: 'username',
      label: 'Username',
      placeholder: 'Username',
      autocomplete: 'username',
    })
  );

  const addressFieldInput = validationFields(
    createInputField({
      id: 'address',
      name: 'address',
      label: 'Address',
      placeholder: 'Address',
      autocomplete: 'street-address',
    })
  );

  const phoneFieldInput = validationFields(
    createInputField({
      id: 'phone',
      name: 'phone',
      label: 'Phone Number',
      placeholder: 'Phone Number',
      autocomplete: 'tel',
    })
  );

  const emailFieldInput = validationFields(
    createInputField({
      id: 'email',
      name: 'email',
      label: 'Email',
      placeholder: 'Email',
      autocomplete: 'email',
    })
  );

  const passwordFieldInput = validationFields(
    createPasswordInputWithIcon({
      id: 'password',
      name: 'password',
      label: 'Password',
      placeholder: 'Password',
      type: 'password',
    })
  );

  const passwordConfirmFieldInput = validationFields(
    createPasswordInputWithIcon({
      id: 'password-confirm',
      name: 'password-confirm',
      label: 'Confirm Password',
      placeholder: 'Confirm Password',
      type: 'password',
    })
  );
  const userNameInput = usernameFieldInput.input;
  const addressInput = addressFieldInput.input;
  const phoneInput = phoneFieldInput.input;
  const emailInput = emailFieldInput.input;
  const passwordInput = passwordFieldInput.input;
  const passwordConfirmInput = passwordConfirmFieldInput.input;

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

  form.appendChild(usernameFieldInput.wrapper);
  form.appendChild(addressFieldInput.wrapper);
  form.appendChild(phoneFieldInput.wrapper);
  form.appendChild(emailFieldInput.wrapper);
  form.appendChild(passwordFieldInput.wrapper);
  form.appendChild(passwordConfirmFieldInput.wrapper);

  form.appendChild(submitBtn);
  formContainer.appendChild(form);

  container.appendChild(formContainer);
  container.appendChild(infoContainer);
  infoContainer.appendChild(infoTitle);
  infoContainer.appendChild(inforegister);
  infoContainer.appendChild(infoList);
  infoContainer.appendChild(infoImg);

  /**
   * Handles form submission.
   *
   * Flow:
   * 1. Prevents default form submit
   * 2. Collects and trims the form values
   * 3. Validates registration data
   * 4. Registers user through the API
   * 5. Automatically logs user in when registration is successful
   * 6. Updates auth state and redirects
   * 7. Handles duplicate account fallback login
   */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      username: userNameInput.value.trim(),
      address: addressInput.value.trim(),
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value,
      passwordConfirm: passwordConfirmInput.value,
    };

    const result = validateRegisterForm(formData);
    if (!result.valid) {
      showToast(result.message || 'invalid form', 'error');
      return;
    }

    try {
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
        window.history.pushState({}, '', `${base}profile`);
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
      usernameFieldInput.icon,
      usernameFieldInput.error,
      isValid,
      'Username must be 3-20 characters and can only contain letters, numbers, underscores, or hyphens.'
    );
  });

  emailInput.addEventListener('input', () => {
    const isValid = isValidEmail(emailInput.value);
    updateFieldState(
      emailInput,
      emailFieldInput.icon,
      emailFieldInput.error,
      isValid,
      'Please enter a valid email address ending with @stud.noroff.no.'
    );
  });

  addressInput.addEventListener('input', () => {
    const isValid = isValidAddress(addressInput.value);
    updateFieldState(
      addressInput,
      addressFieldInput.icon,
      addressFieldInput.error,
      isValid,
      'Please enter a valid address.'
    );
  });

  phoneInput.addEventListener('input', () => {
    const isValid = isValidPhone(phoneInput.value);
    updateFieldState(
      phoneInput,
      phoneFieldInput.icon,
      phoneFieldInput.error,
      isValid,
      'Please enter a valid phone number.'
    );
  });

  passwordInput.addEventListener('input', () => {
    const isValid = isValidPassword(passwordInput.value);
    updateFieldState(
      passwordInput,
      passwordFieldInput.icon,
      passwordFieldInput.error,
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
      passwordConfirmFieldInput.icon,
      passwordConfirmFieldInput.error,
      isValid,
      'Passwords do not match or do not meet the requirements.'
    );
  });

  return container;
}
