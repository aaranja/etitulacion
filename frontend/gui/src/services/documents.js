
const tokenKey = "token";

function getToken() {
    return localStorage.getItem(tokenKey);
}

export function uploadDocument(data) {
    const bearerToken = 'Token ' + getToken();
    
    const options = {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': "*",
            'Authorization': bearerToken,
        },
        body: data
    };
    
    return new Promise((resolve, reject) => {
        fetch('http://localhost:3001/uploadDocument',options)
            .then(data => {
                
            })
            .catch(e => {
                
            })
    })
}