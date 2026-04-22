const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const SESSION_STORAGE_KEY = 'spanish_review_session_key';

async function getSessionKey() {
  let key = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!key) {
    const response = await fetch(`${API_URL}/api/session/`);
    const data = await response.json();
    key = data.session_key;
    localStorage.setItem(SESSION_STORAGE_KEY, key);
  }
  return key;
}

export async function resetSession() {
  const response = await fetch(`${API_URL}/api/session/`);
  const data = await response.json();
  localStorage.setItem(SESSION_STORAGE_KEY, data.session_key);
}

async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const data = await response.json();
      if (data.detail) {
        errorMessage = data.detail;
      } else if (typeof data === 'object') {
        errorMessage = Object.values(data).flat().join(', ');
      }
    } catch (e) {
      // ignore non-JSON bodies
    }
    console.error('API Error:', errorMessage);
    throw new Error(errorMessage);
  }
  return response.json();
}

export function getAllWordTypes() {
  console.log('Fetching word types from:', `${API_URL}/api/word-type-choices/`);
  return getSessionKey().then((key) =>
    fetch(`${API_URL}/api/word-type-choices/`, {
      headers: { 'X-Session-Key': key },
    }).then(handleResponse)
  );
}

export function getAllWords() {
  console.log('Fetching all words...');
  return getSessionKey().then((key) =>
    fetch(`${API_URL}/api/words/`, {
      headers: { 'X-Session-Key': key },
    }).then(handleResponse)
  );
}

export function createSampleWords() {
  console.log('Creating sample words...');
  return getSessionKey().then((key) =>
    fetch(`${API_URL}/api/sample-words/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Key': key,
      },
    }).then(handleResponse)
  );
}

export function updateWord(wordId, updates) {
  console.log(`Updating word ${wordId}:`, updates);
  return getSessionKey().then((key) =>
    fetch(`${API_URL}/api/words/${wordId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Key': key,
      },
      body: JSON.stringify(updates),
    }).then(handleResponse)
  );
}

export function createWord(data) {
  console.log('Creating word:', data);
  return getSessionKey().then((key) =>
    fetch(`${API_URL}/api/words/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Key': key,
      },
      body: JSON.stringify(data),
    }).then(handleResponse)
  );
}

export function deleteWord(wordId) {
  console.log(`Deleting word ${wordId}...`);
  return getSessionKey().then((key) =>
    fetch(`${API_URL}/api/words/${wordId}/`, {
      method: 'DELETE',
      headers: { 'X-Session-Key': key },
    })
  );
}

export function generateQuiz(wordIds) {
  return getSessionKey().then((key) =>
    fetch(`${API_URL}/api/quiz/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Key': key,
      },
      body: JSON.stringify({ word_ids: wordIds }),
    }).then(handleResponse)
  );
}

export function gradeQuiz(questions, answers) {
  return getSessionKey().then((key) =>
    fetch(`${API_URL}/api/grade-quiz/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Key': key,
      },
      body: JSON.stringify({ questions, answers }),
    }).then(handleResponse)
  );
}
