import { Button } from 'bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { BrowserRouter as Router, Routes, Route, Link,useNavigate } from 'react-router-dom';

const Sidebar = (props) => {

  return (
    <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">SupplyChain</Navbar.Brand>
          {props.auth.currentUser? (
            <>
          <Nav className="me-auto">
            
            
            <Nav.Link  as={Link} to="/create">Create Drug</Nav.Link>
            <Nav.Link  as={Link} to="/order">Order Drug</Nav.Link>
            <Nav.Link  as={Link} to="/roles">Roles</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
          <Nav.Link onClick={props.logout}>Logout</Nav.Link>
            </Nav>
            </>):
          <Nav className="me-auto">
            
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/login">login</Nav.Link>
            <Nav.Link as={Link} to="/register">register</Nav.Link>
          </Nav>}
        </Container>
      </Navbar>
  );
};

export default Sidebar;