export function getAllWordTypes() {
  return fetch(`${import.meta.env.VITE_API_URL}/api/word-type-choices/`);
}
export function getAllWords() {
  return fetch(`${import.meta.env.VITE_API_URL}/api/words/`);
}
export function createSampleWords() {
  return fetch(`${import.meta.env.VITE_API_URL}/api/sample-words/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};
