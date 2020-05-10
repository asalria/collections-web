import React, { Component } from "react";
import { fullList } from "./apiBook";
import DefaultBook from "../images/mountains.jpg";
import { Link } from "react-router-dom";

class BooksFull extends Component {
    constructor() {
        super();
        this.state = {
            books: [],
            loading: false
        };
    }

    loadBooks = page => {
        this.setState({loading: true})
        fullList(page).then(data => {
            if (!data) {
                this.setState({ books: [] });
            } else {
                this.setState({ books: data, loading: false });
            }
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
                        <div className="col-sm-4 d-flex" key={i}>
                            <div className="card card-body flex-fill mb-3">
                                <img
                                    src={book.photo}
                                    alt={book.title}
                                    onError={i =>
                                        (i.target.src = `${DefaultBook}`)
                                    }
                                    className="img-thunbnail mb-3"
                                    style={{ height: "auto", width: "70px" }}
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
        const { books, page, loading } = this.state;
        return (
            <div className="container">

                {loading ? (
                    <div className="jumbotron text-center">
                        <h2>Loading...</h2>
                    </div>
                ) : (
                    <>
                    <h2 className="mt-5 mb-5">
                    {!books.length ? "No books!" : "Recent Books"}
                    </h2>
                    
                    <div>
                    {this.renderBooks(books)}
                    </div>
                    </>
                )}
                

            </div>
        );
    }
}

export default BooksFull;
