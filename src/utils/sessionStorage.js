// Thin wrapper around the browser's sessionStorage API.
// Wrapping each call in try/catch handles edge cases that would otherwise
// crash the app — for example, private browsing modes that block storage,
// quota-exceeded errors, or storage being disabled by the user.

const STORAGE_KEY = 'enquiryState';

export const loadState = () => {
  try {
    const serialized = sessionStorage.getItem(STORAGE_KEY);
    if (serialized === null) return undefined;
    return JSON.parse(serialized);
  } catch (err) {
    console.warn('Could not load state from sessionStorage', err);
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serialized = JSON.stringify(state);
    sessionStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.warn('Could not save state to sessionStorage', err);
  }
};

export const clearState = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Could not clear sessionStorage', err);
  }
};
