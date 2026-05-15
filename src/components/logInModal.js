import { loginUser } from '../services/authService';
import showToast from '../ui/showToast.js';
import {
  createPasswordInputWithIcon,
  createInputField,
} from '../utils/createInputWithIcon.js';
import { closeModal, setupEscapeClose } from '../utils/modalUtils.js';

/**
 * Creates and displays the login modal.
 *
 * Features:
 * - Accessible modal dialog
 * - Username/email and password login
 * - Password visibility toggle
 * - SPA navigation support
 * - Login validation and error handling
 * - Escape key and overlay close support
 * - Autofocus on username field
 * - Links to registration and password recovery
 *
 * Authentication state updates are handled through the
 * login service and auth-related events.
 *
 * @returns {void}
 */
export default function logInModal() {
  const modal = document.createElement('div');
  modal.className =
    'fixed inset-0 bg-black/80 flex items-center justify-center z-50';
  modal.dataset.modal = 'login';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'login-modal-title');

  const content = document.createElement('section');
  content.className =
    'relative bg-cover bg-center text-text p-6 flex flex-col items-center justify-center rounded-lg w-full ';

  const contentWrapper = document.createElement('div');
  contentWrapper.className =
    'relative  flex items-center justify-center m-h-[60vh] border-4 border-primary rounded-xl';

  const imageDiv = document.createElement('div');
  imageDiv.className =
    'hidden md:flex md:flex-col items-center justify-center z-10';

  const lemonTitle = document.createElement('h1');
  lemonTitle.className =
    'relative text-3xl font-bold mb-4 text-left text-primary font-poppins z-20';
  lemonTitle.textContent = 'Welcome Back To LemonBids!';
  lemonTitle.id = 'login-modal-title';

  const lemonImage = document.createElement('img');
  lemonImage.src = `${import.meta.env.BASE_URL}images/lemonmascot-1.png`;
  lemonImage.alt = 'LemonBids Logo';
  lemonImage.className = 'w-auto h-full rounded-lg ';

  const form = document.createElement('form');
  form.className =
    'relative bg-primary text-text p-4 w-full md:w-[500px]   h-full md:h-[500px] z-20';
  form.autocomplete = 'on';

  const title = document.createElement('h2');
  title.className =
    'text-2xl font-bold mb-4 text-center text-gray-900 font-poppins';
  title.textContent = 'Log in to your account!';

  const userNameLabel = document.createElement('label');
  userNameLabel.textContent = 'login-Username';
  userNameLabel.className = 'sr-only';
  userNameLabel.htmlFor = 'username';

  const userNameField = createInputField({
    id: 'username',
    name: 'username',
    label: 'login-Username',
    placeholder: 'Username or Email',
  });

  const passwordLabel = document.createElement('label');
  passwordLabel.textContent = 'login-Password';
  passwordLabel.className = 'sr-only';
  passwordLabel.htmlFor = 'password';

  const passwordField = createPasswordInputWithIcon({
    id: 'password',
    name: 'password',
    label: 'login-Password',
    placeholder: 'Password',
  });

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn-primary bg-secondary w-full';
  submitBtn.textContent = 'Log In';

  const newUserLink = document.createElement('p');
  newUserLink.className = 'text-sm mt-4 text-center text-gray-900';

  const link = document.createElement('a');
  link.href = '/register';
  link.className = 'text-secondary mx-auto hover:underline';
  link.textContent = 'Register here';
  link.setAttribute('data-link', '');
  link.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(modal);
  });

  newUserLink.append("Don't have an account? ", link, '.');
  const forgotPasswordLink = document.createElement('p');
  forgotPasswordLink.className = 'text-sm mt-2 text-center text-gray-900';
  forgotPasswordLink.innerHTML =
    '<a href="/forgot-password" class="text-secondary hover:underline" data-link>Forgot your password?</a>.';

  const closeBtn = document.createElement('button');
  closeBtn.className =
    'absolute top-2 right-2 md:right-20 text-4xl text-text md:text-primary hover:text-secondary';
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close login modal');
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => {
    closeModal(modal);
  });

  /**
   * Handles login form submission and authentication.
   *
   * Validates required fields before attempting login.
   * Displays toast feedback for success or failure.
   */

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = userNameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      showToast('Please enter both username and password.');
      return;
    }

    try {
      await loginUser({
        email: username,
        password: password,
      });
      closeModal(modal);
      showToast('Login successful!', 'success');
    } catch (error) {
      showToast(error.message || 'Login failed. Please try again.');
    }
  });

  form.appendChild(title);
  form.appendChild(userNameLabel);
  form.appendChild(userNameField.wrapper);
  const userNameInput = userNameField.input;
  form.appendChild(passwordLabel);
  form.appendChild(passwordField.wrapper);
  const passwordInput = passwordField.input;
  form.appendChild(submitBtn);
  form.appendChild(newUserLink);

  form.appendChild(forgotPasswordLink);
  form.appendChild(closeBtn);

  content.appendChild(lemonTitle);

  content.appendChild(contentWrapper);

  contentWrapper.appendChild(form);
  contentWrapper.appendChild(imageDiv);

  imageDiv.appendChild(lemonImage);

  modal.appendChild(content);

  document.body.appendChild(modal);

  /**
   * Close modal when clicking outside the modal content.
   */
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
  setupEscapeClose(modal);

  /**
   * Autofocus username input after modal renders.
   */
  requestAnimationFrame(() => {
    userNameInput.focus();
  });
}
