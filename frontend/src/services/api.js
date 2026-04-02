export function getAllWordTypes() {
  return fetch('/api/word-type-choices/');
}
export function getAllWords() {
  return fetch('/api/words/');
}
export function createSampleWords() {
  return fetch('/api/sample-words/', {
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
