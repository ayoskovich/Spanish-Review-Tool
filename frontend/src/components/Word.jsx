import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import WordForm from '../components/WordForm';

export default function WordCard({ word, type_options, on_save }) {
  const [showEdit, setShowEdit] = useState(false);
  const [newSpelled, setSpelled] = useState(word.spelled);
  const [newDefinition, setDefinition] = useState(word.definition);
  const [newType, setNewType] = useState(word.word_type);

  function toggleEdit(e) {
    setSpelled(word.spelled);
    setShowEdit(!showEdit);
  }
  const borderColors = {
    verb: 'success',
    noun: 'primary',
    reflexive_verb: 'danger',
  };
  return (
    <Card
      style={{ width: '18rem' }}
      border={borderColors[word.word_type]}
      className="m-1"
      onClick={toggleEdit}
    >
      <Card.Body>
        <Card.Title>{word.spelling}</Card.Title>
        <div className="d-flex justify-content-between align-items-center">
          <Card.Text className="mb-0">{word.definition}</Card.Text>
          <Card.Text className="mb-0 text-muted">{word.word_type}</Card.Text>
        </div>
      </Card.Body>
      {showEdit && (
        <WordForm
          word={word}
          type_options={type_options}
          on_save={(updates) => {
            on_save(word.id, updates);
            setShowEdit(false);
          }}
        />
      )}
    </Card>
  );
}
