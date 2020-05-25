import React, { useState, useEffect } from "react";
import { list } from "./apiBook";
import DefaultBook from "../images/mountains.jpg";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH} from '@fortawesome/free-solid-svg-icons'

import CollectionsModal from '../collection/CollectionsModal';
import { isAuthenticated } from "../auth";
import Modal from "../collection/Modal";
import useModal from '../collection/useModal';
import CardBook from './CardBook';

const Books = () => {
    const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [show, setShow] = useState(false);
 // const {isShowing, toggle} = useModal();


  const loadBooks = page => {
    list(page).then(data => {
        if (data) {
            setBooks(data);
        }
    });
  }
  
  useEffect((page) => {
    loadBooks(page);
  }, []);

  const loadMore = number => {
    setPage(page + number);
    loadBooks(page + number);
   };

   const loadLess = number => {
    setPage(page - number);
    loadBooks(page - number);
    };
    
    const modalToggle = (id) => {
        setShow(!show)
    }

    const renderBooks = books => {

        return (
            <div className="row">
                {books.map((book, i) => {
                    const bookerId = book.createdBy
                        ? `/user/${book.createdBy._id}`
                        : "";
                    const bookerName = book.createdBy
                        ? book.createdBy.name
                        : " Unknown";

                    return (
                        <div className="col-sm-3 d-flex" key={i}>
                            <CardBook book={book}/>
                        </div>
                    );
                })}
            </div>
        );
    };

        return (
            <div className="container card-group">
                <h2 className="mt-5 mb-5">
                    {!books.length ? "No more books!" : "Recent Books"}
                </h2>

                {renderBooks(books)}

                {page > 1 ? (
                    <button
                        className="btn btn-raised btn-warning mr-5 mt-5 mb-5"
                        onClick={() => loadLess(1)}
                    >
                        Previous ({this.state.page - 1})
                    </button>
                ) : (
                    ""
                )}

                {books.length ? (
                    <button
                        className="btn btn-raised btn-success mt-5 mb-5"
                        onClick={() => loadMore(1)}
                    >
                        Next ({page + 1})
                    </button>
                ) : (
                    ""
                )}
            </div>
        );
                }
export default Books;
