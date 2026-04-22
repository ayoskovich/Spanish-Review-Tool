import { NavLink } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './Navbar.css';

export default function NavBar() {
  return (
    <Navbar bg="dark" data-bs-theme="dark" className="navbar-centered">
      <div className="navbar-container">
        <Nav className="me-auto">
          <Nav.Link href="/">Words</Nav.Link>
          <Nav.Link href="/review">Review</Nav.Link>
        </Nav>
      </div>
    </Navbar>
  );
}
