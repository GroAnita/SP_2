import apiClient from './apiClient.js';
import { setAuthState, clearAuthState } from '../state/authState.js';
import { updateAuthUI } from '../ui/authUi.js';

export async function registerUser(data) {
  try {
    const response = await fetch('https://v2.api.noroff.dev/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result.errors?.[0]?.message || 'Registration failed. Please try again.'
      );
    }

    return result;
  } catch (error) {
    throw error;
  }
}

export async function loginUser(data) {
  const response = await apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  const authData = response.data;

  setAuthState(authData);
  updateAuthUI();

  return authData;
}

export function logoutUser() {
  clearAuthState();
  localStorage.removeItem('apiKey');
  updateAuthUI();
}

export async function createApiKey(accessToken) {
  try {
    const response = await fetch(
      'https://v2.api.noroff.dev/auth/create-api-key',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create API key');
    }

    const apiKey = result.data.key;
    localStorage.setItem('apiKey', apiKey);
    return apiKey;
  } catch (error) {
    console.error('Error creating API key:', error);
    return null;
  }
}
