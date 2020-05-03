import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { create, checkISBN, findBooks, findByISBN } from "./apiBook";
import { Redirect, Link } from "react-router-dom";
const ISBN = require( 'isbn-validate' );
var isbnNPM = require('node-isbn');

class NewBook extends Component {
    constructor() {
        super();
        this.state = {
            title: "",
            editorial: "",
            language: "",
            illustrator: "",
            isbn: "",
            photo: "",
            error: "",
            globalError:"",
            user: {},
            fileSize: 0,
            loading: false,
            redirectToProfile: false,
            redirectToNewBook: false,
            errorURL: "",
            book: ""
        };
    }

    componentDidMount() {
        this.bookData = new FormData();
        this.setState({ user: isAuthenticated().user });
    }

    isValid = () => {
        const { title, editorial, language, isbn, fileSize } = this.state;
        if (fileSize > 100000) {
            this.setState({
                error: "File size should be less than 100kb",
                loading: false
            });
            return false;
        }
        if (title.length === 0 || editorial.length === 0 || language.length == 0) {
            this.setState({ error: "All fields are required", loading: false });
            return false;
        }
        return true;
    };

    isUnique = (isbn) => {
        const isbnClean = isbn.replace(/[- ]|^ISBN(?:-1[03])?:?/g, "");
        const token = isAuthenticated().token;
        findByISBN(token, isbnClean)
        .then(data=> {
            console.log(data)
            if(data[0]!=undefined){
                console.log(data[0])
                this.setState({error: 'Book already exists. ', errorURL: data[0]._id});
                return false;
            } else {
                console.log("HHH")
                return true;
            }
        })

        return true;
    };



    handleChange = name => event => {
        this.setState({ error: "" });
        const value =
            name === "photo" ? event.target.files[0] : event.target.value;

        const fileSize = name === "photo" ? event.target.files[0].size : 0;
        this.bookData.set(name, value);
        console.log(this.bookData)
        this.setState({ [name]: value, fileSize });
    };

   checkISBN = (isbn) => {
       // Checks for ISBN-10 or ISBN-13 format
       const regex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)/;

    if (regex.test(isbn)) {
        // Remove non ISBN digits, then split into an array
        var chars = isbn.replace(/[- ]|^ISBN(?:-1[03])?:?/g, "").split("");
        // Remove the final ISBN digit from `chars`, and assign it to `last`
        var last = chars.pop();
        var sum = 0;
        var check, i;
    
        if (chars.length == 9) {
            // Compute the ISBN-10 check digit
            chars.reverse();
            for (i = 0; i < chars.length; i++) {
                sum += (i + 2) * parseInt(chars[i], 10);
            }
            check = 11 - (sum % 11);
            if (check == 10) {
                check = "X";
            } else if (check == 11) {
                check = "0";
            }
        } else {
            // Compute the ISBN-13 check digit
            for (i = 0; i < chars.length; i++) {
                sum += (i % 2 * 2 + 1) * parseInt(chars[i], 10);
            }
            check = 10 - (sum % 10);
            if (check == 10) {
                check = "0";
            }
        }
    
        if (check == last) {
            return true;
        } else {
            console.log("Invalid ISBN check digit")
            return false;
        }
    } else {
        console.log("OTRO ERROR")
        return false;
        
    }
   }

    handleChangeISBN = () => async event  => {
        
        const isbn = event.target.value;
       // isbn = isbn.replace(/[^0-9]/g, '');
       if(this.checkISBN(isbn)){
    
        var cleanISBN = isbn.replace(/[- ]|^ISBN(?:-1[03])?:?/g, "");

        isbnNPM.resolve(isbn)
        .then((responseData) => {
            console.log(responseData)
            if(responseData != null){
                this.setState({ 
                    title: responseData.title,
                    editorial: responseData.publisher,
                    language:  responseData.language,
                    isbn: isbn,
                    error: ''
                 });
                this.bookData.set("title", responseData.title);
                this.bookData.set("editorial", responseData.publisher);
                this.bookData.set("language", responseData.language);
                this.bookData.set("isbn", cleanISBN);
            } else {
                this.bookData.set("isbn", cleanISBN);
            }
            this.setState({error: ''})
        });
       } else {
           this.setState({error: 'Not a valid ISBN'})
       }

       if(isbn.length==0){
        this.setState({error: ''})
       }
        
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });


        if (this.isValid() && this.isUnique(this.state.isbn)) {
            console.log("hola")
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            create(userId, token, this.bookData)
            .then(
              (data) => {
            if(!data.error){
                this.setState({
                    loading: false,
                    title: "",
                    editorial: "",
                    language: "",
                    illustrator: "",
                    isbn: "",
                    error: "",
                    redirectToNewBook: true,
                    book: data
                });
            } else {
                this.setState({error: data.error})
            }

              },
              (error) => {
                console.error(error)
                const { message, errors } = error.response.data;
                this.setState({
                  error: {...errors},
                  globalError: !errors && message
                })
              });
        }
    };

    newBookForm = (title, editorial, language,  illustrator, isbn) => (
        <form>
            
            {isbn ? (
            <div className="form-group">
            <label className="text-muted">Book Photo</label>
            <input
                onChange={this.handleChange("photo")}
                type="file"
                accept="image/*"
                className="form-control"
            />
            </div>
            ): (null)}
            <div className="form-group">
                <label className="text-muted">ISBN</label>
                <textarea
                    onChange={this.handleChangeISBN()}
                    type="text"
                    className="form-control"
                    value={isbn}
                />
            </div>
            
            <div className="form-group">
                <label className="text-muted">Title</label>
                <input
                    onChange={this.handleChange("title")}
                    type="text"
                    className="form-control"
                    value={title}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Editorial</label>
                <textarea
                    onChange={this.handleChange("editorial")}
                    type="text"
                    className="form-control"
                    value={editorial}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Language</label>
                <textarea
                    onChange={this.handleChange("language")}
                    type="text"
                    className="form-control"
                    value={language}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Illustrator</label>
                <textarea
                    onChange={this.handleChange("illustrator")}
                    type="text"
                    className="form-control"
                    value={illustrator}
                />
            </div>

            <button
                onClick={this.clickSubmit}
                className="btn btn-raised btn-primary"
            >
                Add Book
            </button>
        </form>
    );

    render() {
        const {
            title,
            editorial,
            isbn,
            language,
            photo,
            illustrator,
            user,
            error,
            loading,
            redirectToProfile,
            redirectToNewBook,
            errorURL,
            book
        } = this.state;

        const bookId = errorURL
                        ? `/book/${errorURL}`
                        : "";

        if (redirectToProfile) {
            return <Redirect to={`/user/${user._id}`} />;
        }
        if (redirectToNewBook) {
            return <Redirect to={`/book/${book._id}`} />;
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Add a new book</h2>
                <div
                    className="alert alert-danger"
                    style={{ display: error ? "" : "none" }}
                >
                    {error}
                    {errorURL ? (
                            <Link to={`${bookId}`}>
                                {" Check it out here!"}
                            </Link>
                    ): (null)}
                </div>

                {loading && !error? (
                    <div className="jumbotron text-center">
                        <h2>Loading...</h2>
                    </div>
                ) : (
                    ""
                )}

                {this.newBookForm(title, editorial, language, illustrator)}
            </div>
        );
    }
}

export default NewBook;
