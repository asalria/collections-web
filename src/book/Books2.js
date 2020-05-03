import React, { Component } from "react";
import { list } from "./apiBook";
import DefaultBook from "../images/mountains.jpg";
import { Link } from "react-router-dom";
import { CardDeck, Card } from 'react-bootstrap';

class Books2 extends Component {
    constructor() {
        super();
        this.state = {
            books: [],
            page: 1
        };
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
            <>
                {books.map((book, i) => {
                    console.log(book)
                    const bookerId = book.createdBy
                        ? `/user/${book.createdBy._id}`
                        : "";
                    const bookerName = book.createdBy
                        ? book.createdBy.name
                        : " Unknown";

                return(    
                     <>   
                        <Card>
                            <Card.Img
                                    src={book.photo}
                                    alt={book.title}
                                    onError={i =>
                                        (i.target.src = `${DefaultBook}`)
                                    }
                                    className="img-thunbnail mb-3"
                                    style={{ height: "150px", width: "auto" }}
                                />
                                <Card.Body>
                                <Card.Title>{book.title}</Card.Title>
                                <Card.Text>
                                    {book.editorial.substring(0, 100)}
                                </Card.Text>
                                <Card.Footer>
                                    <small className="text-muted">
                                    Posted by{" "}
                                    <Link to={`${bookerId}`}>
                                        {bookerName}{" "}
                                    </Link>
                                    on {new Date(book.created).toDateString()}
                                    </small>
                                </Card.Footer>

                                <Link
                                    to={`/book/${book._id}`}
                                    className="btn btn-raised btn-primary btn-sm"
                                >
                                    Read more
                                </Link>
                            </Card.Body>
                        </Card>
                        </>
                )
                                })
                
                }
                </>
                );
    };

    render() {
        const { books, page } = this.state;
        return (
            <>
                <h2 className="mt-5 mb-5">
                    {!books.length ? "No more books!" : "Recent Books"}
                </h2>
                <CardDeck>
                    
                {this.renderBooks(books)}
                </CardDeck>
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
            
        </>
        );
    }
}

export default Books2;
