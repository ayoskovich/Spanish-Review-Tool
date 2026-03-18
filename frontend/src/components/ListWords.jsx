import { useState, useEffect } from 'react';

export default function WordList() {
  const [words, setWords] = useState([])

  useEffect(() => {
    fetch('/api/words/')
    .then(res => res.json())
    .then(data => setWords(data))
    .catch(err => console.error(err))
  }, [])

  return (
    <ul>
      {words.map(word => (
        <li key={word.id}>{word.spelling} ({word.definition})</li>
      ))}
    </ul>
  )
}
