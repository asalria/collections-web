import React, { Component, createContext } from "react";
const CURRENT_USER_KEY = "current-user";
export const AuthContext = createContext();

class AuthContextProvider extends Component {
  state = {
    user: JSON.parse(localStorage.getItem('jwt') || "{}")
  };
  handleUserChange = user => {
    this.setState({ user });
    if (user) localStorage.setItem('jwt', JSON.stringify(user));
    else localStorage.removeItem('jwt');
  };

  isAuthenticated = () => this.state.user && this.state.user.email;
  render() {
    return (
      <AuthContext.Provider
        value={{
          user: this.state.user,
          onUserChange: this.handleUserChange,
          isAuthenticated: this.isAuthenticated
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export default AuthContextProvider;