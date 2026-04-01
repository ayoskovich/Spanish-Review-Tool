import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function NavBar() {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Nav className="me-auto">
          <Nav.Link href="/">Words</Nav.Link>
          <Nav.Link href="/review">Review</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
