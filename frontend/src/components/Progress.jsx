import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { getAllWords } from '../services/api';

export default function WordList() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    getAllWords().then((data) => setWords(data));
  }, []);

  return (
    <div>
      <h1>Quiz Progress</h1>
    </div>
  );
}
