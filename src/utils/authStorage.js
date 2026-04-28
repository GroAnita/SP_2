export function saveAuthToStorage(authData) {
  localStorage.setItem('authUser', JSON.stringify(authData));
}

export function loadAuthFromStorage() {
  const stored = localStorage.getItem('authUser');
  if (!stored) {
    return null;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function removeAuthFromStorage() {
  localStorage.removeItem('authUser');
}
