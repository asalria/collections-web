import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { Redirect, Link } from "react-router-dom";
import { findUsers } from "../user/apiUser";
import FinderTabs from "./FinderTabs";
import { findBooks } from "../book/apiBook";
import { findCollections } from "../collection/apiCollection";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

class Finder extends Component {
  constructor() {
    super();
    this.state = {
      redirectToSignin: false,
      error: "",
      search: "",
      loading: "",
      books: [],
      collections: [],
      users: [],
      loading: false
    };
  }

  componentDidMount() {
    this.searchData = new FormData();
    if(this.props.location.state != undefined){
      this.setState({
        search: this.props.location.state.search, loading: true
      }, this.init(this.props.location.state.search));

    } 
    
    }

  init = search => {
        console.log(search)
        this.loadUsers(search);
        this.loadBooks(search);
        this.loadCollections(search);
      
  };

  isValid = () => {
    const { search } = this.state;

    if (search.length === 0) {
        this.setState({ error: "All fields are required", loading: false });
        return false;
    }
    return true;
};

  loadBooks = search => {
    const token = isAuthenticated().token;
    findBooks(search, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ books: data });
      }
    });
  };

  loadCollections = search => {
    const token = isAuthenticated().token;
    findCollections(search, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ collections: data });
      }
    });
  };

  loadUsers = search => {
    const token = isAuthenticated().token;
    findUsers(search, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data, loading: false });
      }
    });
  };

    
    handleChange = name => event => {
    this.setState({ error: "" });
    const value = event.target.value;

    this.searchData.set(name, value);
    this.setState({ [name]: value });
    };

    clickSearch = event => {
      
        event.preventDefault();
        this.setState({ loading: true });

        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;

            this.init(this.state.search);
        }
    };


  render() {
    const { redirectToSignin, users, books, collections, search, loading } = this.state;
    if (redirectToSignin) return <Redirect to="/signin" />;



    return (
      <div className="container">
        <div className="row justify-content-center">
                        <div className="col-12 col-md-10 col-lg-8 mt-5 mb-5">
                            <form className="card card-sm">
                                <div className="card-body row no-gutters align-items-center">
                                    <div className="col">
                                        <input className="form-control form-control-lg form-control-borderless" value={search} onChange={this.handleChange("search")} type="search" placeholder="     Search for books, collections or users"/>
                                    </div>
                                    <div className="col-auto">
                                        <button className="btn btn-lg ml-2" onClick={this.clickSearch}><FontAwesomeIcon icon={faSearch} size="2x"/></button>
                                    </div>
                                </div>
                            </form>
                        </div>
        </div>
        {this.state.search ? (
        <div className="row">
            <div className="col-12">
            {loading ? (
                                 <div className="jumbotron text-center">
                                 <h2>Loading...</h2>
                             </div>
            ) : (
              
              <FinderTabs
              users={users}
              books={books}
              collections={collections}
            />
            )}

            </div>
        </div>
        ):<div/>}
      </div>
    );
  }
}

export default Finder;
