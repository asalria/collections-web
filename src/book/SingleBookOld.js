import React, { handler, Component } from 'react';
import { singleBook, remove, like, unlike } from './apiBook';
import {listByUserCol} from '../collection/apiCollection';
import DefaultBook from '../images/mountains.jpg';
import { Link, Redirect } from 'react-router-dom';
import {Modal, Button, InputGroup, Form, FormControl} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare, faPlusCircle} from '@fortawesome/free-solid-svg-icons'

import { isAuthenticated } from '../auth';
import Comment from './Comment';

class SingleBook extends Component {
    state = {
        book: '',
        redirectToHome: false,
        redirectToSignin: false,
        like: false,
        likes: 0,
        show: false,
        collections: [],
        selectedCollections: [],
        comments: []
    };

    checkLike = likes => {
        const userId = isAuthenticated() && isAuthenticated().user._id;
        let match = likes.indexOf(userId) !== -1;
        return match;
    };

    componentDidMount = () => {
        const bookId = this.props.match.params.bookId;
        singleBook(bookId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    book: data,
                    likes: data.likes.length,
                    like: this.checkLike(data.likes),
                    comments: data.comments
                });
            }
        });
    };

    updateComments = comments => {
        this.setState({ comments });
    };

    handleClose = () => {
        this.setState({show: false});
    }

    saveChanges = () => {
        console.log()
        this.handleClose();
    }

    handleOpen = () => {
        this.getCollections();
        this.setState({show: true});
    }

    handleChange = (e) => {
        e.persist();

        if(e.target.checked) {
        console.log("CHECKED")
        console.log(e.target.value)

        this.setState(prevState => ({
            selectedCollections: prevState.selectedCollections.push(e.target.value)
          }, console.log(this.state.selectedCollections)));

        } else {
                console.log("UNCHECKED")
                var array = [ ...this.state.selectedCollections];
                var index = array.indexOf(e.target.value)
                console.log(index)
                if (index !== -1) {
                array = array.splice(1, index)
                console.log(array)
                let arrayAux = [];
                let i = 0;
                
                this.setState(prevState => ({
                    selectedCollections: prevState.selectedCollections.splice(index,1)
                  }, console.log(this.state.selectedCollections)));
                }
        }

       

    }

    likeToggle = () => {
        if (!isAuthenticated()) {
            this.setState({ redirectToSignin: true });
            return false;
        }
        let callApi = this.state.like ? unlike : like;
        const userId = isAuthenticated().user._id;
        const bookId = this.state.book._id;
        const token = isAuthenticated().token;

        callApi(userId, token, bookId).then(data => {
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

    getCollections = () => {
        const userId = isAuthenticated().user._id;
        const {token} = isAuthenticated();
        listByUserCol(userId,token)
        .then(data => {
            if(data.error){
                console.log(data.error);
            } else {
                this.setState({collections: data});
            }
        });

    }

    deleteBook = () => {
        const bookId = this.props.match.params.bookId;
        const token = isAuthenticated().token;
        remove(bookId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ redirectToHome: true });
            }
        });
    };

    deleteConfirmed = () => {
        let answer = window.confirm('Are you sure you want to delete your book?');
        if (answer) {
            this.deleteBook();
        }
    };

    renderBook = book => {
        const bookerId = book.createdBy ? `/user/${book.createdBy._id}` : '';
        const bookerName = book.createdBy ? book.createdBy.name : ' Unknown';

        const { like, likes, show, collections} = this.state;

        return (
            <div className="card-body">
                <img
                    src={`${book.photo}`}
                    alt={book.title}
                    onError={i => (i.target.src = `${DefaultBook}`)}
                    className="img-thunbnail mb-3"
                    style={{
                        height: '300px',
                        width: '100%',
                        objectFit: 'cover'
                    }}
                />
                {isAuthenticated().user && (
                <div className="d-inline-block">
                
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


                <Modal show={show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Select collections:</Modal.Title>
                </Modal.Header>
                <Form>
                <Modal.Body>
                {collections.length==0 ? (
                    <div className="jumbotron text-center">
                        <h2>Loading...</h2>
                    </div>
                ) : (
                
                collections.map((collection, i) => (
                            <div key={i}>
                            <Form.Group>
                            <Form.Check onChange={this.handleChange} value={collection._id} type="checkbox" label={collection.name} />
                            </Form.Group>
                          </div>
                        ))
                        )}
                <hr className="dashed"></hr>
                <Button variant="primary" type="submit">
                    Create new collection
                </Button>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                    Close
                </Button>
                <Button variant="primary" type="submit">
                    Save Changes
                </Button>
                    </Modal.Footer>
                    </Form>
                </Modal>
                
                <Button variant="primary" onClick={this.handleOpen}><FontAwesomeIcon className="mr-2" size="3x" icon={faPlusCircle} /></Button>
                
                </div>  
                )}
                <p className="card-text">{book.editorial}</p>
                <br />
                <p className="font-italic">
                    Posted by <Link to={`${bookerId}`}>{bookerName} </Link>
                    on {new Date(book.created).toDateString()}
                </p>
                <div className="d-inline-block">
                    <Link to={`/`} className="btn btn-raised btn-primary btn-sm mr-5">
                        Back to books
                    </Link>

                    {isAuthenticated().user && isAuthenticated().user._id === book.createdBy._id && (
                        <>
                            <Link to={`/book/edit/${book._id}`} className="btn btn-raised btn-warning btn-sm mr-5">
                                Update Book
                            </Link>
                            <button onClick={this.deleteConfirmed} className="btn btn-raised btn-danger">
                                Delete Book
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
                                        to={`/book/edit/${book._id}`}
                                        className="btn btn-raised btn-warning btn-sm mr-5"
                                    >
                                        Update Book
                                    </Link>
                                    <button onClick={this.deleteConfirmed} className="btn btn-raised btn-danger">
                                        Delete Book
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const { book, redirectToHome, redirectToSignin, comments } = this.state;

        if (redirectToHome) {
            return <Redirect to={`/`} />;
        } else if (redirectToSignin) {
            return <Redirect to={`/signin`} />;
        }

        return (
            <div className="container">
                <h2 className="display-2 mt-5 mb-5">{book.title}</h2>

                {!book ? (
                    <div className="jumbotron text-center">
                        <h2>Loading...</h2>
                    </div>
                ) : (
                    this.renderBook(book)
                )}

                <Comment bookId={book._id} comments={comments.reverse()} updateComments={this.updateComments} />
            </div>
        );
    }
}

export default SingleBook;
