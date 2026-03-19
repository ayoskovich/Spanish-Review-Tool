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
      <h1 className='pb-3'>All Words</h1>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
        {words.map(word => (
          <Card 
            style={{ width: '18rem' }} 
            border= { borderColors[word.word_type]}
            className='m-1'
          >
            <Card.Body>
              <Card.Title>{word.spelling}</Card.Title>
              <div className='d-flex justify-content-between align-items-center'>
              <Card.Text className="mb-0">{word.definition}</Card.Text>
              <Card.Text className="mb-0 text-muted">{word.word_type}</Card.Text>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  )
}
