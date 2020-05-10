import React, { Component, useEffect } from "react";
import {Navbar,Nav,NavDropdown} from 'react-bootstrap'
import { BrowserRouter } from 'react-router-dom';
import { Link, withRouter } from 'react-router-dom';
import { signout } from '../auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt,faUser, faBook, faStream, faBookOpen, faTools } from '@fortawesome/free-solid-svg-icons'
import SocialLogin from "../user/SocialLogin";


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


const NavbarPage = ({ context, history, ...props }) => {

  return(

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
        <>
      <Nav.Link className="nav-link" style={isActive(history, '/signin')} href="/signin">
        Sign In
      </Nav.Link>
        </>
      )}
      {isAuthenticated() && (
        <NavDropdown className="mr-5" title={user.name} id="collasible-nav-dropdown" style={isActive(history, '/create')}>
          <NavDropdown.Item className="" href={`/user/${user._id}`}><FontAwesomeIcon className="mr-2" icon={faUser} /> Profile</NavDropdown.Item>
          {user.role == "admin" && (
          <NavDropdown.Item className="" href={`/admin`}><FontAwesomeIcon className="mr-2" icon={faTools} /> Admin</NavDropdown.Item>
          )}
          <NavDropdown.Item className="" onClick={() => signout(() => history.push('/'))}><FontAwesomeIcon className="mr-2" icon={faSignOutAlt} /> Sign Out</NavDropdown.Item>
        </NavDropdown>
      )}
      </Nav>
    </Navbar.Collapse>
  </Navbar>
  )
          }

export default withRouter(NavbarPage);