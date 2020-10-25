import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { signout, isAuthenticated } from '../auth';
import {Navbar,Nav,NavDropdown} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

class Main extends Component {
    state = {
        search: '',
        go: false
    };

    
    clickSearch = (event) => {
        //  event.preventDefault();
    this.setState({go: true})
/*     this.props.history.push({
        pathname: '/finder',
        search: '?term=' + this.state.search
    }) */
      
    }


      handleChange = name => event => {
        this.setState({ error: "" });
        const value = event.target.value;
        console.log(user)
        this.setState({ [name]: value });
        };


  render() {
    const { redirectToSignin } = this.state;
    if (redirectToSignin) return <Redirect to="/signin" />;

    const divStyle = {
        color: '#ff9900',
        backgroundImage: 'url(https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80)',
        opacity: 0.5
      };

    return (


        <div style={divStyle}>
        <div className="row justify-content-center"  >
        <div className="col-12 col-md-10 col-lg-8 mt-5 mb-5">
            <img src=""/>
            <form className="card card-sm" >
                <div className="card-body row no-gutters align-items-center">
                <div className="col">
                                        <input className="form-control form-control-lg form-control-borderless" onChange={this.handleChange("search")} type="search" placeholder="     Search for books, collections or users"/>
                                    </div>
                                    <div className="col-auto">
                                        <button className="btn btn-lg ml-2" onClick={this.clickSearch}><FontAwesomeIcon icon={faSearch} size="2x"/></button>
                                    </div>
                </div>
            </form>
        </div>
    </div>
    {this.state.go  &&
                <Redirect to={{
                  pathname: '/finder',
                  state: { search: this.state.search }
                }}/>
              }
    </div>

    )}


}




export default Main;



