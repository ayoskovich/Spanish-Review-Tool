import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {
  getAllWords,
  getAllWordTypes,
  getCookie,
  createSampleWords,
} from '../services/api';
import WordCard from '../components/Word';
import WordForm from '../components/WordForm';

export default function WordList() {
  const [words, setWords] = useState([]);
  const [wordTypes, setWordTypes] = useState([]);
  const [addingWord, setAddingWord] = useState(false);

  async function fetchAllWords() {
    getAllWords()
      .then((res) => res.json())
      .then((data) => setWords(data));
  }
  async function getWordTypes() {
    getAllWordTypes()
      .then((res) => res.json())
      .then((data) => setWordTypes(data));
  }
  const onEdit = async (wordId, updates) => {
    const response = await fetch(`/api/words/${wordId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    await fetchAllWords();
  };
  const onCreate = async (updates) => {
    const response = await fetch(`/api/words/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    await fetchAllWords();
    setAddingWord(false);
  };
  const onCreateSamples = async () => {
    await createSampleWords();
    await fetchAllWords();
  };
  const onDelete = async (wordId) => {
    const response = await fetch(`/api/words/${wordId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await fetchAllWords();
  };

  useEffect(() => {
    fetchAllWords();
    getWordTypes();
  }, []);

  return (
    <div>
      <h1>Words</h1>
      <p className="text-secondary mb-3">See below for all your vocab words.</p>
      <Button variant="primary" onClick={() => setAddingWord(true)}>
        Add a new word
      </Button>
      <Button variant="success" onClick={onCreateSamples} className="ms-2">
        Create sample words
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
        {words.map((word) => (
          <WordCard
            key={word.id}
            word={word}
            type_options={wordTypes}
            on_save={onEdit}
            on_delete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
