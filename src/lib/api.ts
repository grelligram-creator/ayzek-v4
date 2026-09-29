import { auth } from './firebase';

/**
 * Sends API requests with the current Firebase ID token. The server remains the
 * source of truth: callers must never send a user id to establish identity.
 */
export async function authenticatedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Bu işlem için giriş yapmalısınız.');
  }

  const token = await user.getIdToken();
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(input, { ...init, headers });
}
