import axios from "axios";

const baseURL = 'http://127.0.0.1:8000';
const tokenKey = "token";

var jwt = require('jsonwebtoken');

export function googleLogin(data) {
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin': "*",
        },
        body: JSON.stringify(data)
    };

    return new Promise((resolve, reject) => {
        fetch(`http://localhost:3001/googleAuth`, options)
            .then(response => {
                if (response.ok)
                    return response.json();
                else
                    reject(response.json());
            })
            .then(data => {
                let user = jwt.decode(data.jwt).user;
                if (saveGoogleToken(data.jwt)) {
                    resolve({code: 200, message: `Welcome ${user.user_name} !`, user});
                } else
                    reject({message: 'Something went wrong. Please reload the page.'});
            })
            .catch(error => {
                reject({message: 'Something went wrong. Please reload the page.'});
            })
    });
}

export function nativeLogin(data) {
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin': "*",
        },
        body: JSON.stringify(data)
    };

    return new Promise((resolve, reject) => {
        fetch(`http://localhost:3001/login`, options)
            .then(response => {
                if (response.ok)
                    return response.json();
                else
                    reject(response.json());
            })
            .then(data => {
                let user = jwt.decode(data.jwt).user;
                if (saveToken(data.jwt)) {
                    resolve({code: 200, message: `Welcome ${user.user_name} !`, user});
                } else
                    reject({message: 'Something went wrong. Please reload the page.'});
            })
            .catch(error => {
                reject({message: 'Something went wrong. Please reload the page.'});
            })
    });

}

const saveToken = (jwt) => {
    try {
        localStorage.setItem(tokenKey, jwt);
        return true;
    } catch (error) {
        return false;
    }
};

export const saveGoogleToken = (token) => {
    try {
        localStorage.setItem(tokenKey, token);
        return true;
    } catch (error) {
        return false;
    }
};


// --------------

export function authLogin(data) {
    const options = {
        method: "POST",
        body: data
    };

    return new Promise((resolve, reject) => {
        axios.post(`${baseURL}/rest-auth/login/`, data)
            .then(response => {
                console.log(response);
                const token = response.data.key;
                if (saveAuthToken(token)) {
                    resolve({code: 200, message: `Welcome!`});
                } else
                    reject({message: 'Something went wrong. Please reload the page.'});
            })
            .catch(error => {
                reject({error, message: 'Something went wrong. Please reload the page.'});
            })
    });
}

const saveAuthToken = (token) => {
    try {
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        
        localStorage.setItem(tokenKey, token);
        localStorage.setItem("expirationDate", expirationDate);
        return true;
    } catch (error) {
        return false;
    }
};