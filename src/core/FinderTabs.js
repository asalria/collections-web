import React, { Component } from "react";
import DefaultProfile from "../images/avatar.jpg";
import { Link } from "react-router-dom";

class FinderTabs extends Component {
    render() {
        const { users, books, collections } = this.props;
        console.log(users.length)
        return (
            <div>

                    {books.length==0 && users.length==0 && collections.length==0 ? (
                        <div className="text-center">
                        <h2>No results</h2>
                    </div>
                    ) : (

                    
                    
            
                <div className="row">
                    <div className="col-md-4">
                        <h3 className="text-primary">
                            {users.length} Users
                        </h3>
                        <hr />
                        {users.map((person, i) => (
                            <div key={i}>
                                <div>
                                    <Link to={`/user/${person._id}`}>
                                        <img
                                            style={{
                                                borderRadius: "50%",
                                                border: "1px solid black"
                                            }}
                                            className="float-left mr-2"
                                            height="30px"
                                            width="30px"
                                            onError={i =>
                                                (i.target.src = `${DefaultProfile}`)
                                            }
                                            src={`${
                                                process.env.REACT_APP_API_URL
                                            }/user/photo/${person._id}`}
                                            alt={person.name}
                                        />
                                        <div>
                                            <p className="lead">
                                                {person.name}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="col-md-4">
                        <h3 className="text-primary">{collections.length} Collections</h3>
                        <hr />
                        {collections.map((collection, i) => (
                            <div key={i}>
                                <div>
                                    <Link to={`/collection/${collection._id}`}>
                                        <div>
                                            <p className="lead">{collection.name}</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="col-md-4">
                        <h3 className="text-primary">{books.length} Books</h3>
                        <hr />
                        {books.map((book, i) => (
                            <div key={i}>
                                <div>
                                    <Link to={`/book/${book._id}`}>
                                        <div>
                                            <p className="lead">{book.title}</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            </div>
            
        );
    }
}

export default FinderTabs;
