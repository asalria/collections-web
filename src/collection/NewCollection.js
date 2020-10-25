import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { create, findCollectionByName } from "./apiCollection";
import { Redirect } from "react-router-dom";



class NewCollection extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            privacy: "",
            tags: [],
            photo: "",
            about: "",
            // setTags: React.useState(["example tag"]),
            user: {},
            fileSize: 0,
            loading: false,
            redirectToProfile: false
        };
    }



    componentDidMount() {
        this.collectionData = new FormData();
        this.setState({ user: isAuthenticated().user });

    }

    isValid = () => {
        const { name, privacy, tags, about, fileSize } = this.state;
        if (fileSize > 100000) {
            this.setState({
                error: "File size should be less than 100kb",
                loading: false
            });
            return false;
        }
        if (name.length === 0 || about.length === 0 ) {
            this.setState({ error: "All fields are required", loading: false });
            return false;
        }
        const token = isAuthenticated().token;
        findCollectionsByName(name, token).then(data => {
        if (data.length>0) {
            this.setState({ error: "Please select a unique name", loading: false });
            return false;
        } else {
            return true;
        }})

        
    };



    handleChange = name => event => {
        this.setState({ error: "" });
        const value =
            name === "photo" ? event.target.files[0] : event.target.value;

        const fileSize = name === "photo" ? event.target.files[0].size : 0;
        this.collectionData.set(name, value);
        this.setState({ [name]: value, fileSize });

    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;

            create(userId, token, this.collectionData).then(data => {
                console.log(this.collectionData.privacy);
                if (data.error) this.setState({ error: data.error });
                else {
                    this.setState({
                        loading: false,
                        name: "",
                        about: "",
                        privacy: "",
                        tags: [],
                        redirectToProfile: true
                    });
                }
            });
        }
    };

    newCollectionForm = (name, about, tags, privacy, setTags) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Collection Photo</label>
                <input
                    onChange={this.handleChange("photo")}
                    type="file"
                    accept="image/*"
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                    onChange={this.handleChange("name")}
                    type="text"
                    className="form-control"
                    value={name}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">About</label>
                <textarea
                    onChange={this.handleChange("about")}
                    type="text"
                    className="form-control"
                    value={about}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Privacy</label>
                <select value={privacy} onChange={this.handleChange("privacy")} className="form-control">
                    <option value="private">Private</option>
                    <option value="followPrivate">Public to followers</option>
                    <option value="public">Public</option>
                </select>
            </div>

{/*             <div className="form-group">
            <label className="text-muted">Tags</label>
            <ReactTagInput 
                tags={tags} 
                onChange={(newTags) => setTags(newTags)}
            />
            </div> */}

            <button
                onClick={this.clickSubmit}
                className="btn btn-raised btn-primary"
            >
                Add Collection
            </button>
        </form>
    );

    render() {
        const {
            name,
            about,
            tags,
            photo,
            privacy,
            user,
            error,
            loading,
            redirectToProfile,
            setTags
        } = this.state;

        if (redirectToProfile) {
            return <Redirect to={`/user/${user._id}`} />;
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Add a new collection</h2>
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

                {this.newCollectionForm(name, about, tags)}
            </div>
        );
    }
}

export default NewCollection;
