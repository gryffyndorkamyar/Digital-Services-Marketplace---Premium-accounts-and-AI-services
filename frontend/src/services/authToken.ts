let currentToken: string | null = null;

export const authTokenStore = {
  get(): string | null {
    if (currentToken) {
      return currentToken;
    }
    const stored = localStorage.getItem('token');
    currentToken = stored || null;
    return currentToken;
  },
  set(token: string | null) {
    currentToken = token;
  },
  clear() {
    currentToken = null;
  },
};
