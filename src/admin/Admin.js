import React, { Component } from "react";
import Books from "../book/Books";
import Collections from "../collection/Collections";
import Users from "../user/Users";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";

class Admin extends Component {
  // Set initial state with redirectToHome to false
  state = {
    redirectToHome: false
  };

  // Check if the user is authenticated and has the role of "admin"
  // If not, redirect to the home page
  componentDidMount() {
    if (isAuthenticated().user.role !== "admin" ) {
      this.setState({ redirectToHome: true });
    }
  }

  // Render the Admin component
  render() {
    // Destructure the redirectToHome variable from state
    const { redirectToHome } = this.state;

    // If redirectToHome is true, redirect to the home page
    if (redirectToHome) {
      return <Redirect to="/" />;
    }

    // Otherwise, render the Admin dashboard
    return (
      <div>
        <div className="jumbotron">
          <h2>Admin Dashboard</h2>
          <p className="lead">Welcome to React Frontend</p>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              <h2>Books</h2>
              <hr />
              <Books />
            </div>
            <div className="col-md-4">
              <h2>Collections</h2>
              <hr />
              <Collections />
            </div>
            <div className="col-md-4">
              <h2>Users</h2>
              <hr />
              <Users />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Admin;