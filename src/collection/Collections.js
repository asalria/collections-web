import React, { Component } from "react";
import { list } from "./apiCollection";
import DefaultCollection from "../images/mountains.jpg";
import { Link } from "react-router-dom";

class Collections extends Component {
    constructor() {
        super();
        this.state = {
            collections: [],
            page: 1
        };
    }

    loadCollections = page => {
        list(page).then(data => {
            if (!data) {
                this.setState({ collections: [] });
            } else {
                this.setState({ collections: data });
            }
        });
    };

    componentDidMount() {
        this.loadCollections(this.state.page);
    }

    loadMore = number => {
        this.setState({ page: this.state.page + number });
        this.loadCollections(this.state.page + number);
    };

    loadLess = number => {
        this.setState({ page: this.state.page - number });
        this.loadCollections(this.state.page - number);
    };

    renderCollections = collections => {
        return (
            <div className="row">
                {collections.map((collection, i) => {
                    const collectionerId = collection.createdBy
                        ? `/user/${collection.createdBy._id}`
                        : "";
                    const collectionerName = collection.createdBy
                        ? collection.createdBy.name
                        : " Unknown";

                    return (
                        <div className="col-sm-4 d-flex" key={i}>
                            <div className="card card-body flex-fill">
                                <img
                                    src={collection.photo}
                                    alt={collection.name}
                                    onError={i =>
                                        (i.target.src = `${DefaultCollection}`)
                                    }
                                    className="img-thunbnail mb-3"
                                    style={{ height: "150px", width: "auto" }}
                                />
                                <h5 className="card-name">{collection.name}</h5>
                                <p className="card-text">
                                    {collection.about ? collection.about.substring(0, 100) : null}
                                </p>
                                <br />
                                <p className="font-italic">
                                    Created by{" "}
                                    <Link to={`${collectionerId}`}>
                                        {collectionerName}{" "}
                                    </Link>
                                    on {new Date(collection.created).toDateString()}
                                </p>
                                <Link
                                    to={`/collection/${collection._id}`}
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
        const { collections, page } = this.state;
        return (
            <div className="container card-group">
                <h2 className="mt-5 mb-5">
                    {!collections.length ? "No more collections!" : "Recent Collections"}
                </h2>

                {this.renderCollections(collections)}

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

                {collections.length ? (
                    <button
                        className="btn btn-raised btn-success mt-5 mb-5"
                        onClick={() => this.loadMore(1)}
                    >
                        Next ({page + 1})
                    </button>
                ) : (
                    ""
                )}
            </div>
        );
    }
}

export default Collections;
