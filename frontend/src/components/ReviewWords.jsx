import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';


export default function ReviewWords() {
  const [questions, setQuestions] = useState([])
  const [allWords, setAllWords] = useState([])
  const [selectedIds, setSelectedIds] = useState([])

  const getCookie = (name) => {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='))
    return cookie ? cookie.split('=')[1] : null
  }

  useEffect(() => {
  fetch('/api/words/')
    .then(r => r.json())
    .then(data => setAllWords(data))
}, [])

const toggleWord = (id) => {
  setSelectedIds(prev =>
    prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
  )
}

  const fetchQuiz = async (wordIds) => {
    const response = await fetch('/api/quiz/', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({ word_ids: wordIds })
    })
    const data = await response.json()
    console.log(data);
    return data.questions
  }

  const handleClick = async () => {
    const qs = await fetchQuiz([]);
    setQuestions(qs);
  }

  const borderColors ={
    verb: 'primary',
    noun: 'success',
    reflexive_verb: 'danger'
  }

  return (
    <div>
      <h1>Review Page</h1>
      <Button variant="outline-info" onClick={handleClick}>Generate Review</Button>
      <div className='d-flex flex-wrap gap-2 mb-3'>
    {allWords.map(word => (
      <button
        key={word.id}
        className={`btn btn-sm ${selectedIds.includes(word.id) ? 'btn-primary' : 'btn-outline-secondary'}`}
        onClick={() => toggleWord(word.id)}
      >
        {word.spelling}
      </button>
    ))}
  </div>
      {questions.map(question => (
      <ul>
        <li>{question.spelling}</li>
        <ul>
          {question.choices.map(opt => (
            <li>{opt}</li>
          ))}
        </ul>
      </ul>
      ))}
    </div>
  )
}
