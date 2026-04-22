import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import {
  getAllWords,
  generateQuiz,
  gradeQuiz as gradeQuizApi,
} from '../services/api';

export default function ReviewWords() {
  const [questions, setQuestions] = useState([]);
  const [allWords, setAllWords] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  async function fetchWords() {
    const words = await getAllWords();
    setAllWords(words)
  }
  useEffect(() => {
    fetchWords()
  }, []);

  const toggleWord = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const fetchQuiz = async () => {
    const data = await generateQuiz(selectedIds);
    return data.questions;
  };

  const gradeQuiz = async (answers) => {
    const data = await gradeQuizApi(questions, answers);
    setResult(data.grades);
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
    setResult([]);
    setAnswers([]);
    setSelectedIds([]);
  };

  const borderColors = {
    verb: 'primary',
    noun: 'success',
    reflexive_verb: 'danger',
  };

  return (
    <div>
      <h1>Review</h1>
      <p className="text-secondary mb-4">
        Choose words to practice and generate a quiz.
      </p>
      <div className="mb-4">
        <h5>Select Words to Review</h5>
        <input
          type="text"
          placeholder="Search words..."
          className="form-control mb-3"
          style={{ maxWidth: '300px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="d-flex flex-wrap gap-2 mb-3">
          {allWords
            .filter((word) => {
              const searchLower = searchTerm.toLowerCase();
              return (
                word.spelling.toLowerCase().includes(searchLower) ||
                (word.word_type &&
                  word.word_type.toLowerCase().includes(searchLower))
              );
            })
            .map((word) => (
              <button
                key={word.id}
                className={`btn btn-sm ${selectedIds.includes(word.id) ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => toggleWord(word.id)}
                title={word.word_type}
              >
                {word.spelling} <small>({word.word_type})</small>
              </button>
            ))}
        </div>
        {selectedIds.length > 0 && (
          <div className="mb-3">
            <p className="mb-2">
              <strong>Selected ({selectedIds.length}):</strong>
            </p>
            <div className="d-flex flex-wrap gap-2">
              {selectedIds.map((id) => {
                const word = allWords.find((w) => w.id === id);
                return (
                  <div
                    key={id}
                    className="badge bg-primary d-flex align-items-center gap-2"
                    style={{ padding: '8px 12px', fontSize: '14px' }}
                  >
                    {word?.spelling}
                    <button
                      className="btn-close"
                      style={{ fontSize: '12px' }}
                      onClick={() => toggleWord(id)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div>
        <Button variant="outline-info" onClick={handleClick}>
          Generate Quiz
        </Button>
      </div>
      {questions.length > 0 && <h5 className="mt-4">Quiz Questions</h5>}
      {questions.map((question) => {
        const questionResult = result?.find(
          (r) => r.word === question.spelling,
        );
        return (
          <div key={question.spelling} className="quiz-question">
            <div className="quiz-question-title">
              <span>{question.spelling}</span>
              {questionResult && (
                <span
                  style={{
                    marginLeft: '10px',
                    fontWeight: 'bold',
                    color: questionResult.right ? '#28a745' : '#dc3545',
                  }}
                >
                  {questionResult.right ? '✓ Correct' : '✗ Wrong'}
                </span>
              )}
            </div>
            <div className="quiz-options">
              {question.choices.map((opt) => {
                const questionResult = result?.find(
                  (r) => r.word === question.spelling,
                );
                const isCorrectAnswer = questionResult && opt === questionResult.correct_answer;
                const isSelected = answers[question.spelling] === opt;
                const isGraded = questionResult !== undefined;
                const isWrongAnswer = isGraded && isSelected && !questionResult.right;

                let optionClass = 'quiz-option';
                if (isGraded && isCorrectAnswer) {
                  optionClass += ' quiz-option-correct';
                }
                if (isWrongAnswer) {
                  optionClass += ' quiz-option-wrong';
                }

                return (
                  <div key={opt} className={optionClass}>
                    <input
                      type="radio"
                      id={`${question.spelling}-${opt}`}
                      name={question.spelling}
                      value={opt}
                      checked={isSelected}
                      onChange={() => handleAnswer(question.spelling, opt)}
                      disabled={isGraded}
                    />
                    <label htmlFor={`${question.spelling}-${opt}`}>{opt}</label>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      {questions.length > 0 && result.length === 0 && (
        <Button variant="primary" onClick={() => gradeQuiz(answers)}>
          Submit and Grade
        </Button>
      )}
      {result.length > 0 && (
        <div
          style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}
        >
          Score: {result.filter((r) => r.right).length} / {result.length}
        </div>
      )}
    </div>
  );
}
