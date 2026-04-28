import { getCurrentUser, isLoggedIn } from '../state/authState.js';

export function updateAuthUI() {
  const loggedIn = isLoggedIn();
  const user = getCurrentUser();

  document.querySelectorAll('[data-auth="logged-in"]').forEach((el) => {
    el.classList.toggle('hidden', !loggedIn);
  });

  document.querySelectorAll('[data-auth="logged-out"]').forEach((el) => {
    el.classList.toggle('hidden', loggedIn);
  });

  document.querySelectorAll('[data-auth="username"]').forEach((el) => {
    el.textContent = user ? user.username : '';
  });
}
