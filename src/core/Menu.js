import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticated } from '../auth';
import {Navbar,Nav,NavDropdown} from 'react-bootstrap'


const isActive = (history, path) => {
    if (history.location.pathname === path) return { color: '#ff9900' };
    else return { color: '#ffffff' };
};

const Menu = ({ history }) => (
    <div className="navbar-collapse">
        <ul className="nav nav-tabs bg-primary">
            <li className="nav-item">
                <Link className="nav-link" style={isActive(history, '/')} to="/">
                    Home
                </Link>
            </li>

            <li className="nav-item">
                <Link
                    className={history.location.pathname === '/users' ? 'active nav-link' : 'not-active nav-link'}
                    to="/users"
                >
                    Users
                </Link>
            </li>

            <li className="nav-item">
{/*                 <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Create
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <Link className="dropdown-item" to="/book/create">Book</Link>
                    <Link className="dropdown-item" to="/collection/create">Collection</Link>
                    
                    
                </div> */}
                <NavDropdown title="Create" id="collasible-nav-dropdown">
                    <NavDropdown.Item href="/book/create">Book</NavDropdown.Item>
                    <NavDropdown.Item href="/collection/create">Collection</NavDropdown.Item>
                </NavDropdown>
            </li>


            {!isAuthenticated() && (
                <React.Fragment>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, '/signin')} to="/signin">
                            Sign In
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, '/signup')} to="/signup">
                            Sign Up
                        </Link>
                    </li>
                </React.Fragment>
            )}

            {isAuthenticated() && isAuthenticated().user.role === 'admin' && (
                <li className="nav-item">
                    <Link to={`/admin`} style={isActive(history, `/admin`)} className="nav-link">
                        Admin
                    </Link>
                </li>
            )}

            {isAuthenticated() && (
                <React.Fragment>
                    <li className="nav-item">
                        <Link to={`/finder`} style={isActive(history, `/finder`)} className="nav-link">
                            Search
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link
                            to={`/user/${isAuthenticated().user._id}`}
                            style={isActive(history, `/user/${isAuthenticated().user._id}`)}
                            className="nav-link"
                        >
                            {`${isAuthenticated().user.name}'s profile`}
                        </Link>
                    </li>

                    <li className="nav-item">
                        <span
                            className="nav-link"
                            style={{ cursor: 'pointer', color: '#fff' }}
                            onClick={() => signout(() => history.push('/'))}
                        >
                            Sign Out
                        </span>
                    </li>
                </React.Fragment>
            )}
        </ul>
    </div>
);

export default withRouter(Menu);



