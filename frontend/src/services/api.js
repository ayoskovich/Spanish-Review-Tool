const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Helper to check response status and throw friendly errors
async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const data = await response.json();
      // Handle Django REST Framework error format
      if (data.detail) {
        errorMessage = data.detail;
      } else if (typeof data === 'object') {
        errorMessage = Object.values(data).flat().join(', ');
      }
    } catch (e) {
      // If response isn't JSON, that's ok
    }
    console.error('API Error:', errorMessage);
    throw new Error(errorMessage);
  }
  return response.json();
}

export function getAllWordTypes() {
  console.log('Fetching word types from:', `${API_URL}/api/word-type-choices/`);
  return fetch(`${API_URL}/api/word-type-choices/`, {
    credentials: 'include',
  })
    .then(handleResponse)
    .catch((error) => {
      console.error('Failed to fetch word types:', error);
      throw error;
    });
}

export function getAllWords() {
  console.log('Fetching all words...');
  return fetch(`${API_URL}/api/words/`, {
    credentials: 'include',
  })
    .then(handleResponse)
    .catch((error) => {
      console.error('Failed to fetch words:', error);
      throw error;
    });
}

export function createSampleWords() {
  console.log('Creating sample words...');
  return fetch(`${API_URL}/api/sample-words/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
  })
    .then(handleResponse)
    .catch((error) => {
      console.error('Failed to create sample words:', error);
      throw error;
    });
}

export function updateWord(wordId, updates) {
  console.log(`Updating word ${wordId}:`, updates);
  return fetch(`${API_URL}/api/words/${wordId}/`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
    body: JSON.stringify(updates),
  })
    .then(handleResponse)
    .catch((error) => {
      console.error('Failed to update word:', error);
      throw error;
    });
}

export function createWord(data) {
  console.log('Creating word:', data);
  return fetch(`${API_URL}/api/words/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
    body: JSON.stringify(data),
  })
    .then(handleResponse)
    .catch((error) => {
      console.error('Failed to create word:', error);
      throw error;
    });
}

export function deleteWord(wordId) {
  console.log(`Deleting word ${wordId}...`);
  return fetch(`${API_URL}/api/words/${wordId}/`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'X-CSRFToken': getCookie('csrftoken'),
    },
  })
    .catch((error) => {
      console.error('Failed to delete word:', error);
      throw error;
    });
}
