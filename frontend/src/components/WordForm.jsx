import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function WordForm({ word, type_options, on_save, on_delete }) {
  const [newSpelled, setSpelled] = useState(word?.spelling);
  const [newDefinition, setDefinition] = useState(word?.definition);
  const [newType, setNewType] = useState(
    word?.word_type || type_options?.[0]?.value,
  );

  function submitForm() {
    on_save({
      spelling: newSpelled,
      definition: newDefinition,
      word_type: newType,
    });
  }
  return (
    <Form onClick={(e) => e.stopPropagation()}>
      <Form.Group className="mb-3" controlId="myformid">
        <Form.Label>Spelling</Form.Label>
        <Form.Control
          as="input"
          defaultValue={newSpelled}
          onChange={(e) => {
            setSpelled(e.target.value);
          }}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="myformid">
        <Form.Label>Definition</Form.Label>
        <Form.Control
          as="input"
          defaultValue={newDefinition}
          onChange={(e) => {
            setDefinition(e.target.value);
          }}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="myformid">
        <Form.Label>Word Type</Form.Label>
        <Form.Select
          defaultValue={newType}
          onChange={(e) => setNewType(e.target.value)}
        >
          {type_options.map((x) => (
            <option key={x.value} value={x.value}>
              {x.label}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Button variant="outline-info" onClick={submitForm} className="my-3">
        Save
      </Button>
      {word && (
        <Button
          variant="outline-danger"
          onClick={on_delete}
          className="my-3 ms-2"
        >
          Delete
        </Button>
      )}
    </Form>
  );
}
