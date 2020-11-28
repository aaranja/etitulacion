
const baseURL = 'http://127.0.0.1:8000';
const tokenKey = "token";

function getToken() {
    return localStorage.getItem(tokenKey);
}

function newPromise(url, options) {
    return new Promise((resolve, reject) => {
        fetch(url, options)
            .then(response => {
                if (response.status === 401)
                    localStorage.removeItem(tokenKey);
                if (response.ok)
                    resolve(response.json());
                else
                    return response.json();
            })
            .then(error => {
                reject(error);
            })
            .catch(e => {
                reject({message: 'Something went wrong. Please reload the page.'});
            })
    });
}

function getPromise(endPoint) {
    const bearerToken = 'Token ' + getToken();
    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin': "*",
            'Authorization': bearerToken
        },
    };

    return newPromise(`${baseURL}${endPoint}`, options);
}

function postPromise(endPoint, data) {
    const bearerToken = 'Token ' + getToken();
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin': "*",
            'Authorization': bearerToken
        },
        body: JSON.stringify(data),
    };

    return newPromise(`${baseURL}${endPoint}`, options);
}


// ---------------

export function getCurrentUser() {
    return getPromise('/api/');
}