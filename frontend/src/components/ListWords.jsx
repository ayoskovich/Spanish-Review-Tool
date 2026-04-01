import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { getAllWords, getAllWordTypes, getCookie } from '../services/api';
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
  };

  useEffect(() => {
    fetchAllWords();
    getWordTypes();
  }, []);

  return (
    <div>
      <h1 className="pb-3">Words</h1>
      <div>See below for all your vocab words.</div>
      <Button variant="primary" onClick={() => setAddingWord(!addingWord)}>
        Add a new word
      </Button>
      {addingWord && <WordForm type_options={wordTypes} on_save={onCreate} />}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 pt-3">
        {words.map((word) => (
          <WordCard
            key={word.id}
            word={word}
            type_options={wordTypes}
            on_save={onEdit}
          />
        ))}
      </div>
    </div>
  );
}
