import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import WordForm from '../components/WordForm';

export default function WordCard({ word, type_options, on_save, on_delete }) {
  const [showEdit, setShowEdit] = useState(false);
  const borderColors = {
    verb: 'success',
    noun: 'primary',
    reflexive_verb: 'danger',
  };
  return (
    <>
      <Card
        style={{ width: '18rem' }}
        border={borderColors[word.word_type]}
        className="m-1"
        onClick={() => setShowEdit(true)}
      >
        <Card.Body>
          <Card.Title>{word.spelling}</Card.Title>
          <div className="d-flex justify-content-between align-items-center">
            <Card.Text className="mb-0">{word.definition}</Card.Text>
            <Card.Text className="mb-0 text-muted">{word.word_type}</Card.Text>
          </div>
        </Card.Body>
      </Card>
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Word</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WordForm
            word={word}
            type_options={type_options}
            on_save={(updates) => {
              on_save(word.id, updates);
              setShowEdit(false);
            }}
            on_delete={() => {
              on_delete(word.id);
              setShowEdit(false);
            }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}
