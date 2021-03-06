import React, { Component } from "react";
import { list } from "./apiBook";
import DefaultBook from "../images/mountains.jpg";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH} from '@fortawesome/free-solid-svg-icons'

import CollectionsModal from '../collection/CollectionsModal';
import { isAuthenticated } from "../auth";
import Modal from "../collection/Modal";
import useModal from '../collection/useModal';


class Books extends Component {
    constructor() {
        super();
        this.state = {
            books: [],
            page: 1,
            show: false,
            visible: false
        };
      //  this.handleOpen = this.handleOpen.bind(this);
    }

    loadBooks = page => {
        list(page).then(data => {
            if (!data) {
                this.setState({ books: [] });
            } else {
                this.setState({ books: data });
            }
        });
    };



    handleOpen = (bookId) => {
        console.log(bookId)
        if(bookId != undefined || bookId.length>3){
            this.props.bookId = bookId;
            this.setState({show: true});
        } 
    }

    showModal = e => {
        this.setState({
          show: !this.state.show
        });
      };

    componentDidMount() {
        this.loadBooks(this.state.page);
    }

    loadMore = number => {
        this.setState({ page: this.state.page + number });
        this.loadBooks(this.state.page + number);
    };

    loadLess = number => {
        this.setState({ page: this.state.page - number });
        this.loadBooks(this.state.page - number);
    };

    renderBooks = books => {
        const { show} = this.state;
        const {isShowing, toggle} = useModal();

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
                            <div className="card card-body flex-fill mb-3">
                                {isAuthenticated().user ? (
                                <div className="row justify-content-end">
                                <div className="col-1">
                                    <CollectionsModal show={show} onClose={()=>this.showModal} book={book._id}></CollectionsModal>
                                    <button className="btn" style={{padding:0}} onClick={toggle} value={book._id} variant="primary">                        
                                        <FontAwesomeIcon icon={faEllipsisH}></FontAwesomeIcon>
                                    </button>
                                    <Modal
        isShowing={isShowing}
        hide={toggle}
      />
                                </div>
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
                        </div>
                    );
                })}
            </div>
        );
    };

    render() {
        const { books, page } = this.state;
        return (
            <div className="container card-group">
                <h2 className="mt-5 mb-5">
                    {!books.length ? "No more books!" : "Recent Books"}
                </h2>

                {this.renderBooks(books)}

                {page > 1 ? (
                    <button
                        className="btn btn-raised btn-warning mr-5 mt-5 mb-5"
                        onClick={() => this.loadLess(1)}
                    >
                        Previous ({this.state.page - 1})
                    </button>
                ) : (
                    ""
                )}

                {books.length ? (
                    <button
                        className="btn btn-raised btn-success mt-5 mb-5"
                        onClick={() => this.loadMore(1)}
                    >
                        Next ({page + 1})
                    </button>
                ) : (
                    ""
                )}
            </div>
        );
    }
}

export default Books;
