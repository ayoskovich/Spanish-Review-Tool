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

  const borderColors ={
    verb: 'primary',
    noun: 'success',
    reflexive_verb: 'danger'
  }

  return (
    <div>
      <ul>
        {words.map(word => (
          <Card 
            style={{ width: '18rem' }} 
            border= { borderColors[word.word_type]}
            className='my-4'
          >
            <Card.Body>
              <Card.Title>{word.spelling}</Card.Title>
              <Card.Subtitle classname="mb-2 text-muted">{word.word_type}</Card.Subtitle>
              <Card.Text>{word.definition}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </ul>
    </div>
  )
}
