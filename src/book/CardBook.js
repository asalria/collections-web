import React, { handler, Component } from 'react';
import { singleBook, remove, like, unlike } from './apiBook';
import {listByUserCol, addBook, removeBook, create} from '../collection/apiCollection';
import DefaultBook from '../images/mountains.jpg';
import { Link, Redirect } from 'react-router-dom';
import {Modal, Button, InputGroup, Form, FormControl} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare, faLock, faLockOpen, faPlus, faPlusCircle, faEllipsisH} from '@fortawesome/free-solid-svg-icons'

import { isAuthenticated } from '../auth';
import Comment from './Comment';
import CollectionsModal from '../collection/CollectionsModal';
import ModalAux from "../collection/Modal";
import useModal from '../collection/useModal';
import ToastAux from "../collection/ToastAux";


const CardBook = ({book}) => {
    const {isShowing, isToast, toggleToast, toggle} = useModal();
    const bookerId = book.createdBy
                        ? `/user/${book.createdBy._id}`
                        : "";
                    const bookerName = book.createdBy
                        ? book.createdBy.name
                        : " Unknown";

    return (
                            <div className="card card-body flex-fill mb-3">
                            {isAuthenticated().user ? (
                            <div className="row justify-content-end">
                                <div className="col-1">
                                    <button className="btn" style={{padding:0}} onClick={toggle} value={book._id} variant="primary">                        
                                        <FontAwesomeIcon icon={faEllipsisH}></FontAwesomeIcon>
                                    </button>
                                </div>
                                { isShowing && 
                                <ModalAux 
                                toggle={toggle}
                                book={book}
                                 />
                                }  
                            </div>

                            ): (null)}

                            <img
                                src={book.photo}
                                alt={book.title}
                                onError={i =>
                                    (i.target.src = `${DefaultBook}`)
                                }
                                className="img-thunbnail mb-3"
                                style={{ height: "auto", width: "100px" }}
                            />
                            <h5 className="card-title">{book.title}</h5>
                            <p className="card-text">
                                {book.editorial.substring(0, 100)}
                            </p>
                            <br />
                            <p className="font-italic">
                                Posted by{" "}
                                <Link to={`${bookerId}`}>
                                    {bookerName}{" "}
                                </Link>
                                on {new Date(book.created).toDateString()}
                            </p>
                            <Link
                                to={`/book/${book._id}`}
                                className="btn btn-raised btn-primary btn-sm"
                            >
                                Read more
                            </Link>
                        </div>
    )
                            }

export default CardBook;