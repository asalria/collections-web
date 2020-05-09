import React, { handler, Component } from 'react';
import { singleCollection, remove, like, unlike, unfollow, follow } from './apiCollection';
import {listByUserCol, addBook, removeBook, create} from './apiCollection';
import DefaultBook from '../images/mountains.jpg';
import { Link, Redirect } from 'react-router-dom';
import {Modal, Button, InputGroup, Form, FormControl} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faMinus, faLockOpen, faPen, faAngleDoubleUp, faThumbsUp, faTrash} from '@fortawesome/free-solid-svg-icons'

import { isAuthenticated } from '../auth';
import Comment from './Comment';

class SingleCollection extends Component {
    state = {
        name: '',
        about: '',
        tags: [],
        privacy: '',
        redirectToSignin: false,
        books: [],
        follow: false,
        follows: 0,
        comments: [],
        collection: {},
        loading: true
    };

    showCreate = () => {
        this.setState({ showForm: true })
    };

    checkLike = likes => {
        const userId = isAuthenticated() && isAuthenticated().user._id;
        let match = likes.indexOf(userId) !== -1;
        return match;
    };

    checkFollow = follows => {
        const userId = isAuthenticated() && isAuthenticated().user._id;
        let match = follows.indexOf(userId) !== -1;
        return match;
    };

    componentDidMount = () => {
        this.setState({ loading: true });
        const collectionId = this.props.match.params.collectionId;
        singleCollection(collectionId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                if(data.likes != undefined){
                    this.setState({
                        collection: data,
                        follows: data.follows.length,
                        following: this.checkFollow(data.follows),
                        likes: data.likes.length,
                        like: this.checkLike(data.likes),
                        comments: data.comments,
                        books: data.books,
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

    followToggle = () => {
        if (!isAuthenticated()) {
            this.setState({ redirectToSignin: true });
            return false;
        }
            let callApi = this.state.following ? unfollow : follow;

            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
        
            callApi(userId, token, this.state.collection._id).then(data => {
              if (data.error) {
                this.setState({ error: data.error });
              } else {
                this.setState({ collection: data, following: !this.state.following });
              }
            });
          
    };

    deleteCollection = () => {
        const collectionId = this.props.match.params.collectionId;
        const token = isAuthenticated().token;
        remove(collectionId, token).then(data => {

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
            this.deleteCollection();
        }
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
        const bookerId = collection.createdBy ? `/user/${collection.createdBy._id}` : '';
        const bookerName = collection.createdBy ? collection.createdBy.name : ' Unknown';

        const { like, likes, show, collections, showForm, comments, loading, follow, follows } = this.state;
        
        return (
            <div className="card-body mt-5">
                <div className="row">
                <div className="col-4">
                <img
                    src={`${collection.photo}`}
                    alt={collection.namee}
                    onError={i => (i.target.src = `${DefaultBook}`)}
                    className="img-thunbnail"
                    style={{
                        height: 'auto',
                        width: '100%',
                        objectFit: 'cover'
                    }}
                />
                </div>
                <div className="col-8">
                    <div className="row">
                    <div className="col-10">
                    <h2 className="card-text">{collection.name}</h2>
                    </div>
                    {isAuthenticated().user && isAuthenticated().user._id === collection.createdBy._id && (
                        <>
                    <div className="col-2">
                        <div className="row">
                            <div className="col">
                            <Link to={`/collection/edit/${collection._id}`}>
                                <FontAwesomeIcon size="2x" icon={faPen} />
                            </Link>
                            </div>
                            <div className="col">
                            <FontAwesomeIcon size="2x" className="text-danger" onClick={this.deleteConfirmed} icon={faTrash} />{' '}
                            </div>
                        </div>                     
                    </div>
                    </>
                    )}
                    </div>
                    <hr className="dashed"></hr>
                    <div className="row">
                        <div className="col-md-6">
                            <label>About:</label>
                        </div>
                        <div className="col-md-6">
                            <p>{collection.about}</p>
                        </div>
                    </div>
                    <hr className="dashed"></hr>
                    <div className="row">
                        <div className="col-md-6">
                            <label>Created By:</label>
                        </div>
                        <div className="col-md-6">
                            <p><Link to={`${bookerId}`}>{bookerName} </Link></p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label>Created On:</label>
                        </div>
                        <div className="col-md-6">
                            <p>{new Date(collection.created).toDateString()}</p>
                        </div>
                    </div>
                    <hr className="dashed"></hr>

                    <div className="row">
                    <div className="col">
                    {like ? (
                    <p onClick={this.likeToggle}>                        
                        <FontAwesomeIcon className="text-success ml-2" size="2x" icon={faThumbsUp} />{' '}
                        {' '}
                        {likes} Like
                    </p>
                ) : (
                    <p onClick={this.likeToggle}>
                        <FontAwesomeIcon className="ml-2" size="2x" icon={faThumbsUp} />{' '}
                        {likes} Like
                    </p>
                )}
                    </div>
                <div className="col">
                {follow ? (
                    <p onClick={this.followToggle}>                        
                        <FontAwesomeIcon className="text-success ml-2" size="2x" icon={faAngleDoubleUp} />{' '}
                        {' '}
                        {follows} Follow
                    </p>
                ) : (
                    <p onClick={this.followToggle}>
                        <FontAwesomeIcon className="ml-2" size="2x" icon={faAngleDoubleUp} />{' '}
                        {follows} Follow
                    </p>
                )}
                </div>
                </div>
                </div>
            </div>
            </div>
        );
    };

    render() {
        const { collection, redirectToHome, redirectToSignin, loading, comments, books } = this.state;

        if (redirectToHome ) {
            return <Redirect to={`/`} />;
        } else if (redirectToSignin) {
            return <Redirect to={`/signin`} />;
        }

        console.log(books)

        return (
            <div className="container">
                {loading ? (
                    <div className="jumbotron text-center">
                        <h2>Loading...</h2>
                    </div>
                ) : 
                collection ? (this.renderCollection(collection)) : (
                        <div className="text-center">
                        <h2>No results</h2>
                    </div>
                    )
                    
                }
                <h4 className="display-2 mt-5 mb-5" hidden={!books.length>0}>Books</h4> 
                {this.renderBooks(books)}
               
                {/* <Comment collectionId={collection._id} comments={comments.reverse()} updateComments={this.updateComments} /> */}
              
          </div>      
        );
    }
}

export default SingleCollection;
