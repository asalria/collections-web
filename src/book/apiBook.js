export const create = (userId, token, book) => {
    return fetch(`${process.env.REACT_APP_API_URL}/book/new/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: book
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const findByISBN = (token, isbn) => {
    return fetch(`${process.env.REACT_APP_API_URL}/book/isbn/${isbn}`, {
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
}

export const findBooks = (search) => {
    return fetch(`${process.env.REACT_APP_API_URL}/books/${search}`, {
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
    return fetch(`${process.env.REACT_APP_API_URL}/books/?page=${page}`, {
        method: "GET"
    }) 
    .then(response => {
            return response.json();
    })
    .catch(err => console.log(err));
};

// without pagination
export const fullList = () => {
    console.log("H")
    return fetch(`${process.env.REACT_APP_API_URL}/books/all`, {
        method: "GET"
    }) 
    .then(response => {
            return response.json();
    })
    .catch(err => console.log(err));
};

export const singleBook = bookId => {
    return fetch(`${process.env.REACT_APP_API_URL}/book/${bookId}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const listByUser = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/books/by/${userId}`, {
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

export const remove = (bookId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/book/${bookId}`, {
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

export const update = (bookId, token, post) => {
    console.log(bookId, token, post);
    return fetch(`${process.env.REACT_APP_API_URL}/book/${bookId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: post
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const like = (userId, token, bookId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/book/like`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, bookId })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const unlike = (userId, token, bookId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/book/unlike`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, bookId })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const comment = (userId, token, bookId, comment) => {
    return fetch(`${process.env.REACT_APP_API_URL}/book/comment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, bookId, comment })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const uncomment = (userId, token, bookId, comment) => {
    return fetch(`${process.env.REACT_APP_API_URL}/book/uncomment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, bookId, comment })
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

export const fetchData = async isbn => {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(isbn)}`)
    .then((response)=> response.json())
    .then((responseData) => {
        return responseData
    });
    
    
  };

export const checkISBN = ( isbn ) => {
    const PREFIX = /^ISBN(?:-1[03])?:?\x20+/i;
    const ISBN = /^(?:\d{9}[\dXx]|\d{13})$/;

        if( !ISBN.test( isbn ) ) {
            return '';
        }
        
    //isbn have to be number or string (composed only of digits or char "X"):
    isbn = isbn.toString();

    //Remove last digit (control digit):
    let number = isbn.slice( 0,-1 );
	
    //Convert number to array (with only digits):
    number = number.split( '' ).map( Number );
    
    //Save last digit (control digit):
    const last = isbn.slice( -1 );
    const lastDigit = ( last !== 'X' ) ? parseInt( last, 10 ) : 'X';

    //Algorithm for checksum calculation (digit * position):
    number = number.map( ( digit, index ) => {
        return digit * ( index + 1 );
    } );
    
    //Calculate checksum from array:
    const sum = number.reduce( ( a, b ) => a + b, 0 );

    //Validate control digit:
    const controlDigit = sum % 11;
/*     if (lastDigit === ( controlDigit !== 10 ? controlDigit : 'X' )){
        console.log(isbn);
        
    } else console.log(controlDigit); */

  // here is how you call this function
  const data = fetchData(isbn);




};



