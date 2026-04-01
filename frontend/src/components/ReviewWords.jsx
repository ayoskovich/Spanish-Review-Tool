import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export default function ReviewWords() {
  const [questions, setQuestions] = useState([]);
  const [allWords, setAllWords] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState('');

  const getCookie = (name) => {
    const cookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith(name + '='));
    return cookie ? cookie.split('=')[1] : null;
  };

  useEffect(() => {
    fetch('/api/words/')
      .then((r) => r.json())
      .then((data) => setAllWords(data));
  }, []);

  const toggleWord = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const fetchQuiz = async () => {
    const response = await fetch('/api/quiz/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({ word_ids: selectedIds }),
    });
    const data = await response.json();
    return data.questions;
  };

  const gradeQuiz = async (answers) => {
    const response = await fetch('/api/grade-quiz/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({ questions: questions, answers: answers }),
    });
    const data = await response.json();
    await setResult(data.grades);
  };

  const handleAnswer = (spelling, choice) => {
    setAnswers((prev) => ({
      ...prev,
      [spelling]: choice,
    }));
  };
  const handleClick = async () => {
    const qs = await fetchQuiz();
    setQuestions(qs);
  };

  const borderColors = {
    verb: 'primary',
    noun: 'success',
    reflexive_verb: 'danger',
  };

  return (
    <div>
      <h1>Review Page</h1>
      {result && (
        <div>
          {result.map((x) => (
            <p>
              {x.word} - ({x.right ? 'Correct!' : 'Wrong :('})
            </p>
          ))}
        </div>
      )}
      <div className="d-flex flex-wrap gap-2 mb-3">
        {allWords.map((word) => (
          <button
            key={word.id}
            className={`btn btn-sm ${selectedIds.includes(word.id) ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => toggleWord(word.id)}
          >
            {word.spelling}
          </button>
        ))}
      </div>
      <div>
        <Button variant="outline-info" onClick={handleClick}>
          Generate Quiz
        </Button>
      </div>
      {questions.map((question) => (
        <ul key={question.spelling}>
          <li>{question.spelling}</li>
          <ul>
            {question.choices.map((opt) => (
              <li key={opt}>
                <label>
                  <input
                    type="radio"
                    name={question.spelling}
                    value={opt}
                    checked={answers[question.spelling] === opt}
                    onChange={() => handleAnswer(question.spelling, opt)}
                  />
                  {opt}
                </label>
              </li>
            ))}
          </ul>
        </ul>
      ))}
      <Button variant="primary" onClick={() => gradeQuiz(answers)}>
        Submit and Grade
      </Button>
    </div>
  );
}
