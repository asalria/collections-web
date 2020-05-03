import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { update, singleCollection } from "./apiCollection";
import { Redirect } from "react-router-dom";
import "@pathofdev/react-tag-input/build/index.css";


class EditCollection extends Component {
    constructor() {
        super();
        this.state = {
            id:"",
            name: "",
            privacy: "",
            tags: [],
            photo: "",
            about: "",
            user: {},
            fileSize: 0,
            loading: false,
            redirectToProfile: false
        };
    }

    init = collectionId => {

        singleCollection(collectionId).then(data => {
            if (data.error) {
                this.setState({ redirectToProfile: true });
            } else {
                this.setState({
                    id: data.createdBy._id,
                    name: data.name,
                    about: data.about,
                    privacy: data.privacy,
                    photo: data.photo,
                    user: data.createdBy,
                    error: "",
                    loading: false
                });
            }
        });
    };

    componentDidMount() {
        this.collectionData = new FormData();
        this.setState({ user: isAuthenticated().user });
        const collectionId = this.props.match.params.collectionId;
        this.init(collectionId);
    };

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
        return true;
    };



    handleChange = name => event => {
        this.setState({ error: "" });
        const value =
            name === "photo" ? event.target.files[0] : event.target.value;

        const fileSize = name === "photo" ? event.target.files[0].size : 0;
        this.collectionData.set(name, value);
        console.log(this.collectionData)
        this.setState({ [name]: value, fileSize });

    };

    clickSubmit = event => {
        event.preventDefault();
        const collectionId = this.props.match.params.collectionId;

        this.setState({ loading: true });

        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;

            update(collectionId, token, this.collectionData).then(data => {
                console.log(this.collectionData);
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
                Save Collection
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
                <h2 className="mt-5 mb-5">Edit a collection</h2>
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

export default EditCollection;
