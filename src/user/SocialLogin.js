import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { socialLogin, authenticate } from '../auth';
import { AuthContext } from "../context/AuthContext";

class SocialLogin extends Component {
    constructor() {
        super();
        this.state = {
            redirectToReferrer: false
        };
    }

     responseGoogle = response => {
        const tokenId = response.tokenId;
        const user = {
            tokenId: tokenId
        }; 

        socialLogin(user)
        .then(data=> {
            if (data.error) {
                this.setState({ error: data.error, loading: false });
            } else {
                // authenticate
                authenticate(data, () => {
                    this.setState({ redirectToReferer: true }, window.history.push('/'));
                });
            }
        
        })
        .catch(err => console.log(err))
     }

    

    render() {
        // redirect
        const { redirectToReferrer } = this.state;
        if (redirectToReferrer) {
            return <Redirect to="/" />;
        }

        return (    
             <GoogleLogin
            clientId="399479435902-9i03bv7ergt57l7pd6k598rfb9662174.apps.googleusercontent.com"
            style={{
                border: 'none',
                background: 'none',
                padding: 0,
                margin: 0 
              }}
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
            cookiePolicy={'single_host_origin'}
          />  
        );
    }


}

export default SocialLogin;
