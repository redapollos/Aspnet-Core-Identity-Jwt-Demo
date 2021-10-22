import axios from "axios";

// set default baseURL
axios.defaults.baseURL = process.env.REACT_APP_WEBAPI_URL;

// create a response interceptor to check for 401s
axios.interceptors.response.use (
    response => response,
    error => {
        
        if(error.response) {
            const {status} = error.response;
            if (status === 401) {
                localStorage.removeItem('user_info');
                window.location.reload(true);
            }
        }
        
        return Promise.reject(error);
    }
);

// create a default instance of axios
const instance = axios.create({
    responseType: "json"
});


//#region generic crud methods
instance.getData = (url, needsAuth) => {    
    const requestOptions = needsAuth === true || needsAuth === undefined ? { headers: authHeader() } : {};

    return new Promise((resolve, reject) => {
        axios.get(url, requestOptions)
            .then(res => {
                resolve(res.data);
            })
            .catch(res => {
                reject(formatReject(res));
            })
    });
}

instance.upsertData = (id, url, data, needsAuth) => {
    if(id === undefined || id === null || id === 0 || id === "")
        return instance.postData(url, data, needsAuth);
    else
        return instance.putData(`${url}/${id}`, data, needsAuth);
}

instance.postData = (url, data, needsAuth) => {
    const requestOptions = needsAuth === true || needsAuth === undefined ? { headers: authHeader() } : {};

    return new Promise((resolve, reject) => {
        axios.post(url, data, requestOptions)
            .then(res => {
                resolve(res.data);
            })
            .catch(res => {
                reject(formatReject(res));
            })
    });
}

instance.putData = (url, data, needsAuth) => {
    const requestOptions = needsAuth === true || needsAuth === undefined ? { headers: authHeader() } : {};

    return new Promise((resolve, reject) => {
        axios.put(url, data, requestOptions)
            .then(res => {
                resolve(res.data);
            })
            .catch(res => {
                reject(formatReject(res));
            })
    });
}

instance.deleteData = (url) => {
    const requestOptions = { headers: authHeader() }; // deletes always need security

    return new Promise((resolve, reject) => {
        axios.delete(url, requestOptions)
            .then(res => {
                resolve(res.data);
            })
            .catch(res => {
                reject(formatReject(res));
            })
    });
}

instance.deleteMultipleData = (url, ids) => {
    const requestOptions = { 
        headers: authHeader(), // deletes always need security
        data: { ids } 
    };

    return new Promise((resolve, reject) => {
        axios.delete(url, requestOptions)
            .then(res => {
                resolve(res.data);
            })
            .catch(res => {
                reject(formatReject(res));
            })
    });
}

function formatReject(res) {    
    if(res === null)
        return "error";
        
    // normal operation
    if(res.response) {
        if(Array.isArray(res.response.data)) {
            let m = res.response.data.map((o, idx) => {
                return o.description;
            });
            return m.join("\n");
        }
    
        return res.response.data;
    }
    else if (res.request) {
        return "network error";
    }
    else
        return "error";
    
}
//#endregion

export default instance;

export function authHeader() {
    // return authorization header with jwt token
    let info = localStorage.getItem('user_info');
    let user = info !== null ? JSON.parse(window.atob(info)) : null;

    if (user && user.token) {
        return { 
            'Authorization': 'Bearer ' + user.token,
            'Content-Type': 'application/json'
         };
    } else {
        return {'Content-Type': 'application/json'};
    }
}