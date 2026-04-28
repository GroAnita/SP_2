import { loginUser } from '../services/authService';

export default function logInModal() {
  const modal = document.createElement('div');
  modal.className =
    'fixed inset-0 bg-black/80 flex items-center justify-center z-50';
  modal.dataset.modal = 'login';

  const content = document.createElement('div');
  content.className =
    'relative bg-cover bg-center text-text p-6 flex flex-col items-center justify-center rounded-lg w-full ';

  const contentWrapper = document.createElement('div');
  contentWrapper.className =
    'relative  flex items-center justify-center m-h-[60vh] border-4 border-primary rounded-xl';

  const imageDiv = document.createElement('div');
  imageDiv.className =
    'hidden md:flex md:flex-col items-center justify-center z-10';

  const lemonTitle = document.createElement('h2');
  lemonTitle.className =
    'relative text-3xl font-bold mb-4 text-left text-primary font-poppins z-20';
  lemonTitle.textContent = 'Welcome Back To LemonBids!';

  const lemonImage = document.createElement('img');
  lemonImage.src = `${import.meta.env.BASE_URL}images/lemonmascot-1.png`;
  lemonImage.alt = 'LemonBids Logo';
  lemonImage.className = 'w-auto h-full rounded-lg ';

  const form = document.createElement('form');
  form.className =
    'relative bg-primary text-text p-4 w-full md:w-[500px]   h-full md:h-[500px] z-20';
  form.autocomplete = 'on';

  const title = document.createElement('h2');
  title.className = 'text-2xl font-bold mb-4 text-center font-poppins';
  title.textContent = 'Log in to your account!';

  const userNameInput = document.createElement('input');
  userNameInput.type = 'text';
  userNameInput.name = 'username';
  userNameInput.placeholder = 'Username';
  userNameInput.className = 'input w-full mb-4 bg-card active:bg-secondary';
  userNameInput.autocomplete = 'username';

  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.name = 'password';
  passwordInput.placeholder = 'Password';
  passwordInput.autocomplete = 'current-password';
  passwordInput.className = 'input w-full mb-4';

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn-primary bg-secondary w-full';
  submitBtn.textContent = 'Log In';

  const newUserLink = document.createElement('p');
  newUserLink.className = 'text-sm mt-4 text-center text-text';
  newUserLink.innerHTML =
    'Don\'t have an account? <a href="/register" class="text-secondary hover:underline" data-link>Register here</a>.';

  const forgotPasswordLink = document.createElement('p');
  forgotPasswordLink.className = 'text-sm mt-2 text-center text-text';
  forgotPasswordLink.innerHTML =
    '<a href="/forgot-password" class="text-secondary hover:underline" data-link>Forgot your password?</a>.';

  const closeBtn = document.createElement('button');
  closeBtn.className =
    'absolute top-2 right-2 md:right-20 text-4xl text-text md:text-primary hover:text-secondary';
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => {
    modal.remove();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = userNameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }

    try {
      await loginUser({
        email: username,
        password: password,
      });
      alert('Login successful!');
      modal.remove();
    } catch (error) {
      alert(error.message || 'Login failed. Please try again.');
    }
  });

  form.appendChild(title);
  form.appendChild(userNameInput);
  form.appendChild(passwordInput);
  form.appendChild(submitBtn);
  form.appendChild(newUserLink);
  form.appendChild(forgotPasswordLink);
  form.appendChild(closeBtn);
  content.appendChild(closeBtn);

  content.appendChild(lemonTitle);

  content.appendChild(contentWrapper);

  contentWrapper.appendChild(form);
  contentWrapper.appendChild(imageDiv);

  imageDiv.appendChild(lemonImage);

  modal.appendChild(content);

  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}
