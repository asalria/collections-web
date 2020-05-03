
import React, { Component } from 'react';
import { singleCollection, remove, like, unlike, removeBook } from './apiCollection';
import DefaultCollection from '../images/mountains.jpg';
import DefaultBook from "../images/mountains.jpg";
import { Link, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import Comment from './Comment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus} from '@fortawesome/free-solid-svg-icons'


class SingleCollection extends Component {
    state = {
        name: '',
        about: '',
        tags: [],
        privacy: '',
        redirectToSignin: false,
        books: [],
        comments: [],
        collection: {},
        loading: false
    }

   

    componentDidMount = () => {
        console.log("asdf")
        this.setState({ loading: true });
        const collectionId = this.props.match.params.collectionId;
        singleCollection(collectionId).then(data => {
            console.log(data)
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    collection: data,
                    likes: data.likes.length,
                    like: this.checkLike(data.likes),
                    books: data.books,
                    comments: data.comments,
                    loading: false
                });
            }
        });
    };

    checkLike = likes => {
        const userId = isAuthenticated() && isAuthenticated().user._id;
        let match = likes.indexOf(userId) !== -1;
        return match;
    };

    updateComments = comments => {
        this.setState({ comments });
    };

    updateBooks = books => {
        this.setState({ books });
    };

    likeToggle = () => {
        if (!isAuthenticated()) {
            this.setState({ redirectToSignin: true });
            return false;
        }
        let callApi = this.state.like ? unlike : like;
        const userId = isAuthenticated().user._id;
        const collectionId = this.state.collection._id;
        const token = isAuthenticated().token;

        callApi(userId, token, collectionId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    like: !this.state.like,
                    likes: data.likes.length
                });
            }
        });
    };

    deleteCollection = () => {
        const collectionId = this.props.match.params.collectionId;
        const token = isAuthenticated().token;
        remove(collectionId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ redirectToHome: true });
            }
        });
    };

    deleteBook = (bookId) => {
        const collectionId = this.props.match.params.collectionId;
        const token = isAuthenticated().token;
        removeBook(isAuthenticated().user._id, isAuthenticated().token, this.state.collection, bookId)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                console.log(data);
                
            }
        })
    };

    deleteConfirmed = () => {
        let answer = window.confirm('Are you sure you want to delete your collection?');
        if (answer) {
            this.deleteCollection();
        }
    };

    deleteBookConfirmed = (event) => {
        let answer = window.confirm('Are you sure you want to delete this book?');
        if (answer) {
            this.deleteBook(event.target.value);
        }
    };

    renderBooks = books => {
        console.log(books)
        return (

            <div className="row">
                {books.map((book, i) => {
                    console.log(i)
                    const bookerId = book.createdBy
                        ? `/user/${book.createdBy._id}`
                        : "";
                    const bookerName = book.createdBy
                        ? book.createdBy.name
                        : " Unknown";

                    return (
                        <div className="card col-md-3 mr-3 mt-3" key={i}>
                            <div className="card-body">
                                <img
                                    src={book.photo}
                                    alt={book.title}
                                    onError={i =>
                                        (i.target.src = `${DefaultBook}`)
                                    }
                                    className="img-thunbnail mb-3"
                                    style={{ height: "150px", width: "auto" }}
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
                                <div className="overlay"></div>
                                <div className="button">
                                    <FontAwesomeIcon onClick={this.deleteBookConfirmed} icon={faMinus} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    renderCollection = collection => {
        const collectionerId = collection.createdBy ? `/user/${collection.createdBy._id}` : '';
        const collectionerName = collection.createdBy ? collection.createdBy.name : ' Unknown';

        const { like, books, likes, comments, comment } = this.state;

        return (
            <div className="card-body">
                <h2 className="display-2 mt-5 mb-5">{collection.name}</h2>
                <img
                    src={`${process.env.REACT_APP_API_URL}/collection/photo/${collection._id}`}
                    alt={collection.name}
                    onError={i => (i.target.src = `${DefaultCollection}`)}
                    className="img-thunbnail mb-3"
                    style={{
                        height: '150px',
                        width: '100%',
                        objectFit: 'cover'
                    }}
                />

                {like ? (
                    <h3 onClick={this.likeToggle}>
                        <i
                            className="fa fa-thumbs-up text-success bg-dark"
                            style={{ padding: '10px', borderRadius: '50%' }}
                        />{' '}
                        {likes} Like
                    </h3>
                ) : (
                    <h3 onClick={this.likeToggle}>
                        <i
                            className="fa fa-thumbs-up text-warning bg-dark"
                            style={{ padding: '10px', borderRadius: '50%' }}
                        />{' '}
                        {likes} Like
                    </h3>
                )}

                <p className="card-text">{collection.about}</p>
                <br />
                <p className="font-italic mark">
                    Collection created by <Link to={`${collectionerId}`}>{collectionerName} </Link>
                    on {new Date(collection.created).toDateString()}
                </p>
                
                <div className="d-inline-block mb-5">
                    <Link to={`/`} className="btn btn-raised btn-primary btn-sm mr-5">
                        Back to collections
                    </Link>



                    {isAuthenticated().user && isAuthenticated().user._id === collection.createdBy._id && (
                        <>
                            <Link to={`/collection/edit/${collection._id}`} className="btn btn-raised btn-warning btn-sm mr-5">
                                Update Collection
                            </Link>
                            <button onClick={this.deleteConfirmed} className="btn btn-raised btn-danger">
                                Delete Collection
                            </button>
                        </>
                    )}

                    <div>
                        {isAuthenticated().user && isAuthenticated().user.role === 'admin' && (
                            <div class="card mt-5">
                                <div className="card-body">
                                    <h5 className="card-title">Admin</h5>
                                    <p className="mb-2 text-danger">Edit/Delete as an Admin</p>
                                    <Link
                                        to={`/collection/edit/${collection._id}`}
                                        className="btn btn-raised btn-warning btn-sm mr-5"
                                    >
                                        Update Collection
                                    </Link>
                                    <button onClick={this.deleteConfirmed} className="btn btn-raised btn-danger">
                                        Delete Collection
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <h4 className="display-2 mt-5 mb-5">Books</h4>

                {this.renderBooks(books)}
                {comments ? (
                <Comment collectionId={collection._id} comments={comments ? comments.reverse() : null} updateComments={this.updateComments} />

                ): (null)}

            </div>
            
        );
    };

    render() {
        const { collection, redirectToHome, redirectToSignin, comments, loading } = this.state;

        if (redirectToHome) {
            return <Redirect to={`/`} />;
        } else if (redirectToSignin) {
            return <Redirect to={`/signin`} />;
        }

        return (
            <div className="container">
                

                {loading ? (
                    <div className="jumbotron text-center">
                        <h2>Loading...</h2>
                    </div>
                ) : (
                    

                    this.renderCollection(collection)
                )}

            </div>
        );
    }
}

export default SingleCollection;
