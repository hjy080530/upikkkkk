export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue || null;
  }
  return null;
};

export const setCookie = (name: string, value: string, days: number = 7): void => {
  if (typeof document === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

export const deleteCookie = (name: string): void => {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export const getAccessToken = (): string | null => {
  const cookieToken = getCookie('access-token');
  if (cookieToken) {
    try {
      localStorage.setItem('access-token', cookieToken);
    } catch (_error) {
    }
    return cookieToken;
  }
  
  try {
    const localToken = localStorage.getItem('access-token');
    if (localToken) {
      return localToken;
    }
  } catch (_error) {
  }
  
  return null;
};

export const setAccessToken = (token: string): void => {
  try {
    localStorage.setItem('access-token', token);
  } catch (_error) {
  }
};

export const removeAccessToken = (): void => {
  try {
    localStorage.removeItem('access-token');
    deleteCookie('access-token');
  } catch (_error) {
  }
};
