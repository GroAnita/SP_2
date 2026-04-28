let authState = null;

const AUTH_STORAGE_KEY = 'authUser';

export function setAuthState(authData) {
  authState = authData;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
  document.dispatchEvent(new Event('auth:changed'));
}

export function clearAuthState() {
  authState = null;
  localStorage.removeItem(AUTH_STORAGE_KEY);
  document.dispatchEvent(new Event('auth:changed'));
}

export function getAuthState() {
  if (authState) return authState;
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;
  try {
    authState = JSON.parse(stored);
    return authState;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return Boolean(getAuthToken());
}

export function getCurrentUser() {
  const state = getAuthState();
  if (!state) return null;
  return {
    username: state.name,
    email: state.email,
  };
}

export function getAuthToken() {
  const state = getAuthState();
  return state?.accessToken || null;
}
