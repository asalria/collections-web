import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import { socialLogin, authenticate } from '../auth';

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
                console.log("IN")
                authenticate(data, () => {
                    this.setState({ redirectToReferer: true });
                });
            }
        
        })
        .catch(err => console.log(err))
     }

        signIn = () =>{
            console.log("Hola")
            socialLogin.then(data => {
                debugger
                // console.log('signin data: ', data);
                if (data.error) {
                    console.log('Error Login. Please try again..');
                } else {
                    // console.log('signin success - setting jwt: ', data);
                    authenticate(data, () => {
                        console.log('social login response from api', data);
                        this.setState({ redirectToReferrer: true });
                    });
                }
            });
        }

    

    render() {
        // redirect
        const { redirectToReferrer } = this.state;
        if (redirectToReferrer) {
            return <Redirect to="/" />;
        }

        return (        
/*             <Button
                onClick={this.Signin} >
            </Button> */
             <GoogleLogin
            clientId="399479435902-9i03bv7ergt57l7pd6k598rfb9662174.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
            cookiePolicy={'single_host_origin'}
          />  
        );
    }
}

export default SocialLogin;
