export const create = (userId, token, collection) => {
    return fetch(`${process.env.REACT_APP_API_URL}/collection/new/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: collection
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const findCollections = (search) => {
    return fetch(`${process.env.REACT_APP_API_URL}/collections/${search}`, {
        method: "GET",
        headers: {
            Accept: "application/json"
        },
    }) 
    .then(response => {
            return response.json();
    })
    .catch(err => console.log(err));
}

// with pagination
export const list = page => {
    return fetch(`${process.env.REACT_APP_API_URL}/collections/?page=${page}`, {
        method: "GET"
    }) 
    .then(response => {
            return response.json();
    })
    .catch(err => console.log(err));
};

export const singleCollection = collectionId => {
    return fetch(`${process.env.REACT_APP_API_URL}/collection/${collectionId}`, {
        method: "GET"
    })
        .then(response => {
            console.log(response)
            return response.json();
        })
        .catch(err => console.log(err));
};

export const listByUserCol = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/collections/by/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const remove = (collectionId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/collection/delete/${collectionId}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const update = (collectionId, token, collection) => {
    return fetch(`${process.env.REACT_APP_API_URL}/collection/update/${collectionId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: collection
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const like = (userId, token, collectionId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/collection/like`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, collectionId })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const unlike = (userId, token, collectionId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/collection/unlike`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, collectionId })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const follow = (userId, token, collectionId) => {
    console.log("follow")
    return fetch(`${process.env.REACT_APP_API_URL}/collection/follow`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, collectionId })
    })
        .then(response => {
        
            return response.json();
        })
        .catch(err => console.log(err));
};

export const unfollow = (userId, token, collectionId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/collection/unfollow`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, collectionId })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const comment = (userId, token, collectionId, comment) => {
    return fetch(`${process.env.REACT_APP_API_URL}/collection/comment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, collectionId, comment })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const uncomment = (userId, token, collectionId, comment) => {
    return fetch(`${process.env.REACT_APP_API_URL}/collection/uncomment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, collectionId, comment })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

/* export const fetchData = (isbn) => {
//    console.log(isbn);
    fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(isbn)}`)
    .then((response)=> response.json())
    .then((responseData)=> {
//      console.log(responseData);
      return responseData;
    });
}; */

export const addBook = (userId, token, collectionId, bookId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/collection/book`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, collectionId, bookId })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const removeBook = (userId, token, collectionId, bookId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/collection/unbook`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, collectionId, bookId })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};






