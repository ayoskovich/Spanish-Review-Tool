import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import {
  getAllWords,
  getAllWordTypes,
  createSampleWords,
  updateWord,
  createWord,
  deleteWord,
  resetSession,
} from '../services/api';
import WordCard from '../components/Word';
import WordForm from '../components/WordForm';

export default function WordList() {
  const [words, setWords] = useState([]);
  const [wordTypes, setWordTypes] = useState([]);
  const [addingWord, setAddingWord] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchAllWords() {
    try {
      setError(null);
      const data = await getAllWords();
      console.log('Loaded words:', data);
      setWords(data);
    } catch (err) {
      const message = err.message || 'Failed to load words';
      setError(message);
      console.error('Error fetching words:', err);
    }
  }

  async function getWordTypes() {
    try {
      setError(null);
      const data = await getAllWordTypes();
      console.log('Loaded word types:', data);
      setWordTypes(data);
    } catch (err) {
      const message = err.message || 'Failed to load word types';
      setError(message);
      console.error('Error fetching word types:', err);
    }
  }

  const onEdit = async (wordId, updates) => {
    try {
      setError(null);
      await updateWord(wordId, updates);
      await fetchAllWords();
    } catch (err) {
      const message = err.message || 'Failed to update word';
      setError(message);
      console.error('Error updating word:', err);
    }
  };

  const onCreate = async (updates) => {
    try {
      setError(null);
      await createWord(updates);
      await fetchAllWords();
      setAddingWord(false);
    } catch (err) {
      const message = err.message || 'Failed to create word';
      setError(message);
      console.error('Error creating word:', err);
    }
  };

  const onRestart = async () => {
    await resetSession();
    setWords([]);
    await fetchAllWords();
  };

  const onCreateSamples = async () => {
    try {
      setError(null);
      await createSampleWords();
      await fetchAllWords();
    } catch (err) {
      const message = err.message || 'Failed to create sample words';
      setError(message);
      console.error('Error creating samples:', err);
    }
  };

  const onDelete = async (wordId) => {
    try {
      setError(null);
      await deleteWord(wordId);
      await fetchAllWords();
    } catch (err) {
      const message = err.message || 'Failed to delete word';
      setError(message);
      console.error('Error deleting word:', err);
    }
  };

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        setError(null);
        await Promise.all([fetchAllWords(), getWordTypes()]);
      } catch (err) {
        console.error('Error initializing:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  return (
    <div>
      <h1>Words</h1>
      <p className="text-secondary mb-3">See below for all your vocab words.</p>

      {error && (
        <Alert
          variant="danger"
          onClose={() => setError(null)}
          dismissible
          className="mb-3"
        >
          <strong>Error:</strong> {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <Button variant="primary" onClick={() => setAddingWord(true)}>
            Add a new word
          </Button>
          <Button variant="success" onClick={onCreateSamples} className="ms-2">
            Create sample words
          </Button>
          <Button variant="outline-danger" onClick={onRestart} className="ms-2">
            Start fresh
          </Button>
          <Modal
            show={addingWord}
            onHide={() => setAddingWord(false)}
            backdrop="true"
            keyboard={true}
          >
            <Modal.Header closeButton>
              <Modal.Title>Add a New Word</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <WordForm type_options={wordTypes} on_save={onCreate} />
            </Modal.Body>
          </Modal>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 pt-3">
            {words.length === 0 ? (
              <div className="col-12">
                <p className="text-muted">No words yet. Create one to get started!</p>
              </div>
            ) : (
              words.map((word) => (
                <WordCard
                  key={word.id}
                  word={word}
                  type_options={wordTypes}
                  on_save={onEdit}
                  on_delete={onDelete}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
