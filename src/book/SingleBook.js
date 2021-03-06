import React, { handler, Component } from 'react';
import { singleBook, remove, like, unlike } from './apiBook';
import {listByUserCol, addBook, removeBook, create} from '../collection/apiCollection';
import DefaultBook from '../images/mountains.jpg';
import { Link, Redirect } from 'react-router-dom';
import {Modal, Button, InputGroup, Form, FormControl} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare, faLock, faLockOpen, faPlus, faPlusCircle, faThumbsUp} from '@fortawesome/free-solid-svg-icons'

import { isAuthenticated } from '../auth';
import Comment from './Comment';
import CollectionsModal from '../collection/CollectionsModal';

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
        existingCollections: [],
        comments: [],
        showForm: false,
        loading: false,
        loadingModal: false,
        error: '',
        completed: false
    };

    showCreate = () => {
        this.setState({ showForm: true })
    };

    checkLike = likes => {
        const userId = isAuthenticated() && isAuthenticated().user._id;
        let match = likes.indexOf(userId) !== -1;
        return match;
    };

    componentDidMount = () => {
        this.setState({ loading: true });
        const bookId = this.props.match.params.bookId;
        singleBook(bookId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                console.log(data)
                if(data.likes != undefined){
                    this.setState({
                        book: data,
                        likes: data.likes.length,
                        like: this.checkLike(data.likes),
                        comments: data.comments,
                        loading: false
                    });
                }
                else {
                    this.setState({redirectToHome: true})
                }

            }
        });
    };

    updateComments = comments => {
        this.setState({ comments });
    };

    handleClose = () => {
        this.setState({show: false});
    }

    handleCloseAlert = () => {
        this.setState({completed: false})
    }

    saveChanges = () => {
        console.log()
        this.handleClose();
    }

    handleOpen = () => {
        this.setState({show: true});
        console.log("ASDFASS")
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
                var index = this.state.selectedCollections.indexOf(e.target.value)
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

    showModal = e => {
        this.setState({
          show: !this.state.show
        });
      };

    
    submitForm = (event) => {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        this.collectionData = new FormData();
        let remove = this.state.existingCollections.filter(x => !this.state.selectedCollections.includes(x));
        let add = this.state.selectedCollections.filter(x=> !this.state.existingCollections.includes(x));

        console.log(remove)
        console.log(add)
       

        add.forEach(collection => {
            addBook(isAuthenticated().user._id, isAuthenticated().token, collection, this.state.book._id)
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    console.log(data);
                    
                }
            });

        })

        remove.forEach(collection => {
            removeBook(isAuthenticated().user._id, isAuthenticated().token, collection, this.state.book._id)
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    console.log(data);
                    
                }
            })
        });

        if (data.get('collectionName') != undefined){
            this.collectionData.set('name', data.get('collectionName'));
            this.collectionData.set('privacy', data.get('collectionPrivacy'));
            create(isAuthenticated().user._id, isAuthenticated().token, this.collectionData)
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    
                        addBook(isAuthenticated().user._id, isAuthenticated().token, data._id, this.state.book._id)
                        .then(result => {
                            if (result.error) {
                                console.log(result.error);
                            } else {
                                this.setState({completed: true})
                                this.handleClose();
                            }
                        });
                }
            });
 
        } else {
            this.setState({completed: true})
            this.handleClose();
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


    deleteBook = () => {
        const bookId = this.props.match.params.bookId;
        const token = isAuthenticated().token;
        remove(bookId, token).then(data => {

                this.setState({ redirectToHome: true });
        })
        .catch(err => {
            this.setState({error: err})
        })
        ;
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

        const { like, likes, show, collections, showForm, comments, loading, loadingModal, completed, selectedCollections} = this.state;
        
        return (
            <div className="card-body mt-5">
                <div className="row">
                <div className="col">
                <img
                    src={`${book.photo}`}
                    alt={book.title}
                    onError={i => (i.target.src = `${DefaultBook}`)}
                    className="img-thunbnail"
                    style={{
                        height: 'auto',
                        width: '30%',
                        objectFit: 'cover'
                    }}
                />
                </div>
                <div className="col">
                    <h2 className="card-text">{book.title}</h2>
                    <hr className="dashed"></hr>
                    <div className="row">
                        <div className="col-md-6">
                            <label>Editorial:</label>
                        </div>
                        <div className="col-md-6">
                            <p>{book.editorial}</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label>ISBN:</label>
                        </div>
                        <div className="col-md-6">
                            <p>{book.isbn}</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label>Language:</label>
                        </div>
                        <div className="col-md-6">
                            <p>{book.language}</p>
                        </div>
                    </div>
                    <hr className="dashed"></hr>
                    <div className="row">
                        <div className="col-md-6">
                            <label>Added By:</label>
                        </div>
                        <div className="col-md-6">
                            <p><Link to={`${bookerId}`}>{bookerName} </Link></p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label>Added On:</label>
                        </div>
                        <div className="col-md-6">
                            <p>{new Date(book.created).toDateString()}</p>
                        </div>
                    </div>
                    <hr className="dashed"></hr>
                    {isAuthenticated().user && (
                    <div className="row">
                    <div className="col">
                    {like ? (
                    <p onClick={this.likeToggle}>                        
                        <FontAwesomeIcon className="text-success" size="2x" icon={faThumbsUp} />{' '}
                        {' '}
                        {likes} Like
                    </p>
                ) : (
                    <p onClick={this.likeToggle}>
                        <FontAwesomeIcon size="2x" icon={faThumbsUp} />{' '}
                        {likes} Like
                    </p>
                )}
                    </div>
                    <div className="col">

                    <CollectionsModal show={show} onClose={this.showModal} book={book}></CollectionsModal>
                    <p onClick={this.handleOpen} variant="primary">                        
                        <FontAwesomeIcon size="2x" icon={faPlusCircle} />
                        {' '}
                        Add to collection
                    </p>
                    </div>
                    </div>
                    )}
                </div>
                </div>
                <br />
                <div className="d-inline-block">


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
                            <div className="card mt-5">
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
                <Comment bookId={book._id} comments={comments.reverse()} updateComments={this.updateComments} />
            
            </div>
        );
    };

    render() {
        const { book, redirectToHome, redirectToSignin, loading } = this.state;

        if (redirectToHome ) {
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
                ) : 
                        book ? (this.renderBook(book)) : (
                        <div className="text-center">
                        <h2>No results</h2>
                    </div>
                    )
                    
                }

          </div>      
        );
    }
}

export default SingleBook;
