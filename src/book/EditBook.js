import React, { Component } from "react";
import { singleBook, update } from "./apiBook";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";
const DefaultBook= "https://cdn.pixabay.com/photo/2018/01/03/09/09/book-3057901_1280.png";

class EditBook extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            title: "",
            editorial: "",
            language: "",
            isbn: "",
            photo: "",
            redirectToProfile: false,
            redirectToBook: false,
            error: "",
            fileSize: 0,
            loading: false,
            hideImg: false
        };
    }

    init = bookId => {
        console.log(bookId)
        singleBook(bookId).then(data => {
            if (data.error) {
                this.setState({ redirectToProfile: true });
            } else {
                this.setState({
                    id: data.createdBy._id,
                    title: data.title,
                    editorial: data.editorial,
                    isbn: data.isbn,
                    photo: data.photo,
                    language: data.language,
                    error: "",
                    loading: false
                });
            }
        });
    };

    componentDidMount() {
        this.setState({loading: true});
        this.bookData = new FormData();
        const bookId = this.props.match.params.bookId;
        this.init(bookId);
    }

    isValid = () => {
        const { title, editorial, language, isbn, fileSize } = this.state;
        if (fileSize > 1000000) {
            this.setState({
                error: "File size should be less than 100kb",
                loading: false
            });
            return false;
        }
        if (title.length === 0 || editorial.length === 0) {
            this.setState({ error: "All fields are required", loading: false });
            return false;
        }
        return true;
    };

    handleChange = name => event => {
        this.setState({ error: "" });
        const value =
            name === "photo" ? event.target.files[0] : event.target.value;

        const fileSize = name === "photo" ? event.target.files[0].size : 0;
        if(event.target.files != undefined){
            console.log("Hola")
            this.setState({hideImg: true})
        }
        this.bookData.set(name, value);
        this.setState({ [name]: value, fileSize });
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        if (this.isValid()) {
            const bookId = this.props.match.params.bookId;
            const token = isAuthenticated().token;

            update(bookId, token, this.bookData).then(data => {
                if (data.error) this.setState({ error: data.error });
                else {
                    this.setState({
                        loading: false,
                        title: "",
                        body: "",
                        editorial: "",
                        isbn: "",
                        language: "",
                        redirectToProfile: false,
                        redirectToBook: true,
                        loading: false
                    });
                }
            });
        }
    };

    editBookForm = (title, isbn, editorial, language, photo, hideImg) => (
        <>
        {!hideImg ? (
        <img
            style={{ height: "200px", width: "auto" }}
            className="img-thumbnail"
            src={photo}
            onError={i => (i.target.src = `${DefaultBook}`)}
            alt={title}
        />
        ):(null)}

        <hr className="dashed"></hr>
        
        <form className="mt-3">
            <div className="form-group">
                <label className="text-muted">Book Photo</label>
                <input
                    onChange={this.handleChange("photo")}
                    type="file"
                    accept="image/*"
                    className="form-control"
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
                <input
                    onChange={this.handleChange("editorial")}
                    type="text"
                    className="form-control"
                    value={editorial}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">ISBN</label>
                <textarea
                    onChange={this.handleChange("isbn")}
                    type="text"
                    className="form-control"
                    readOnly
                    value={isbn}
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

            <button
                onClick={this.clickSubmit}
                className="btn btn-raised btn-primary"
            >
                Update Book
            </button>
        </form>
        </>
    );

    render() {
        const {
            id,
            title,
            editorial,
            language,
            photo,
            isbn,
            redirectToProfile,
            redirectToBook,
            error,
            loading,
            hideImg
        } = this.state;

        if (redirectToProfile) {
            return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
        }

        if(redirectToBook){
            return <Redirect to={`/book/${id}`} />;

        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">{title}</h2>

                <div
                    className="alert alert-danger"
                    style={{ display: error ? "" : "none" }}
                >
                    {error}
                </div>

                {loading ? (
                    <div className="jumbotron text-center">
                        <h2>Loading...</h2>
                    </div>
                ) : (
                    ""
                )}
                

                {isAuthenticated().user.role === "admin" &&
                    this.editBookForm(title, isbn, editorial, language, photo, hideImg)}

                {isAuthenticated().user._id === id &&
                    this.editBookForm(title, isbn, editorial, language, photo, hideImg)}
            </div>
        );
    }
}

export default EditBook;
