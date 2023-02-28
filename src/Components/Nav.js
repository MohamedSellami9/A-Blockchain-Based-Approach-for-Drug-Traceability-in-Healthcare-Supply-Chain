import React from 'react'
import Nav from 'react-bootstrap/Nav';
import {LinkContainer} from 'react-router-bootstrap'
import { BrowserRouter as Router, Routes, Route, Link,useNavigate } from 'react-router-dom';

const MainNav = (props) => {
    
  return (
    <Nav  variant="tabs" defaultActiveKey="/home"
    //onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
    >
    
      <LinkContainer to="/">
        <Nav.Link>Home</Nav.Link>
      </LinkContainer>
      {props.auth.currentUser ? (
        <>
          
            <LinkContainer to="/create">
              <Nav.Item>Create Drug</Nav.Item>
              </LinkContainer>
              <LinkContainer to="/order">
              <Nav.Item>Order Drug</Nav.Item>
              </LinkContainer>
              <LinkContainer to="/roles">
              <Nav.Item>Roles</Nav.Item>
              </LinkContainer>
              
              <Nav.Item onClick={props.logout} >Logout</Nav.Item>
      
        </>
      ) : (
        <>
        <LinkContainer to="/login">
              <Nav.Item>Login</Nav.Item>
        </LinkContainer>
              <LinkContainer to="/register">
              <Nav.Item>Register</Nav.Item>
              </LinkContainer>
          
           
        </>
      )}
    
  </Nav>
  )
}

export default MainNav;