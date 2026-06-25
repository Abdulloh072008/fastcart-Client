/** Build the login URL that returns the user to `from` after authenticating. */
export const loginWithRedirect = (from: string): string =>
  `/login?redirect=${encodeURIComponent(from)}`
