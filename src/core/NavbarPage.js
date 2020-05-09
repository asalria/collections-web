import React, { Component } from "react";
import {Navbar,Nav,NavDropdown} from 'react-bootstrap'
import { HashRouter } from 'react-router-dom';
import { Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticated } from '../auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt,faUser, faBook, faStream, faBookOpen } from '@fortawesome/free-solid-svg-icons'



const isActive = (history, path) => {
  if(path === '/create') {
    
    if (history.location.pathname === '/book/create' || history.location.pathname === '/collection/create'){
    return { color: '#ff9900' };
    }
  } 
  else if (history.location.pathname === path) {
    return { color: '#ff9900' };
  } else return { color: '#ffffff' };
  
};

const NavbarPage = ({ history }) => (

    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
    <Navbar.Brand href="/" style={isActive(history, '/')}><FontAwesomeIcon className="mr-2" size="2x" icon={faBookOpen} /></Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link href="/users" style={isActive(history, '/users')} className={history.location.pathname === '/users' ? 'active nav-link' : 'not-active nav-link'}>Users</Nav.Link>
        <NavDropdown title="Add" id="collasible-nav-dropdown" style={isActive(history, '/create')}>
          <NavDropdown.Item href="/book/create"><FontAwesomeIcon className="mr-2" icon={faBook} />Book</NavDropdown.Item>
          <NavDropdown.Item href="/collection/create"><FontAwesomeIcon className="mr-2" icon={faStream} />Collection</NavDropdown.Item>
        </NavDropdown>
      </Nav>
      <Nav>
      {!isAuthenticated() && (
        <Nav.Link href="/signin">Sign in</Nav.Link>
      )}
      {!isAuthenticated() && (
        <Nav.Link href="/signup">Register</Nav.Link>
      )}
      {isAuthenticated() && (
        <NavDropdown className="mr-5" title={isAuthenticated().user.name} id="collasible-nav-dropdown" style={isActive(history, '/create')}>
          <NavDropdown.Item className="" href={`/user/${isAuthenticated().user._id}`}><FontAwesomeIcon className="mr-2" icon={faUser} /> Profile</NavDropdown.Item>
          <NavDropdown.Item className="" onClick={() => signout(() => history.push('/'))}><FontAwesomeIcon className="mr-2" icon={faSignOutAlt} /> Sign Out</NavDropdown.Item>
        </NavDropdown>
      )}
      </Nav>
    </Navbar.Collapse>
  </Navbar>

)

export default withRouter(NavbarPage);