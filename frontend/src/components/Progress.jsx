import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';


export default function WordList() {
  const [words, setWords] = useState([])

  useEffect(() => {
    fetch('/api/words/')
    .then(res => res.json())
    .then(data => setWords(data))
  }, [])

  return (
    <div>
      <h1>Quiz Progress</h1>
    </div>
  )
}
