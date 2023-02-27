import React from 'react'
import Nav from 'react-bootstrap/Nav';
import {LinkContainer} from 'react-router-bootstrap'
import { BrowserRouter as Router, Routes, Route, Link,useNavigate } from 'react-router-dom';

const MainNav = (props) => {
    
  return (
    <Nav  activeKey="/home"
    onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}>
    
      <LinkContainer to="/">
        <Nav.Link >Home</Nav.Link>
      </LinkContainer>
      {props.auth.currentUser ? (
        <>
          <Nav.Item>
            <Link to="/create">Create Drug</Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/order">Order Drug</Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/roles">Roles</Link>
          </Nav.Item>
          <Nav.Item>
            <button onClick={props.logout}>Logout</button>
          </Nav.Item>
        </>
      ) : (
        <>
          <Nav.Item>
            <Link to="/login">Login</Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/register">Register</Link>
          </Nav.Item>
        </>
      )}
    
  </Nav>
  )
}

export default MainNav;