// Exporting functions for authentication and user management

// Signup function to register a new user
export const signup = user => {
    return fetch(`${process.env.REACT_APP_API_URL}/signup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

// Signin function to authenticate an existing user
export const signin = user => {
    return fetch(`${process.env.REACT_APP_API_URL}/signin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

// Function to authenticate user and store JWT token in localStorage
export const authenticate = (jwt, next) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('jwt', JSON.stringify(jwt));
        next();
    }
};

// Function to store user name in localStorage
export const setName = (name, next) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('username', JSON.stringify(name));
        next();
    }
};

// Signout function to remove JWT token from localStorage and call server-side signout endpoint
export const signout = next => {
    if (typeof window !== 'undefined') localStorage.removeItem('jwt');
    next();
    return fetch(`${process.env.REACT_APP_API_URL}/signout`, {
        method: 'GET'
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

// Function to check if user is authenticated by checking JWT token in localStorage
export const isAuthenticated = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    if (localStorage.getItem('jwt')) {
        return JSON.parse(localStorage.getItem('jwt'));
    } else {
        return false;
    }
};

// Function to send a forgot password request to the server
export const forgotPassword = email => {
    console.log('email: ', email);
    return fetch(`${process.env.REACT_APP_API_URL}/forgot-password/`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
        .then(response => {
            console.log('forgot password response: ', response);
            return response.json();
        })
        .catch(err => console.log(err));
};

// Function to send a reset password request to the server
export const resetPassword = resetInfo => {
    return fetch(`${process.env.REACT_APP_API_URL}/reset-password/`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resetInfo)
    })
        .then(response => {
            console.log('forgot password response: ', response);
            return response.json();
        })
        .catch(err => console.log(err));
};

// Function for social login with a given user object
export const socialLogin = user => {
    return fetch(`${process.env.REACT_APP_API_URL}/social-login/`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        // credentials: "include", // works only in the same origin
        body: JSON.stringify(user)
    })
        .then(response => {
            console.log('signin response: ', response);
            return response.json();
        })
        .catch(err => console.log(err));
};

export const socialLogin2 = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/auth/google/`)
        .then(response => {
            console.log('signin response: ', response);
            return response.json();
        })
        .catch(err => console.log(err));
};