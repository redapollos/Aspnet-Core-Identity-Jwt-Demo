import axios from './AxiosHelper';

// define public methods
export const authenticationService = {    
    login,
    confirmEmail,
    confirmPassword,
    resetPassword
};


function login(o) {
    return axios.postData(`/api/authentication/login`, o, false);
}

function confirmEmail(o) {
    return axios.postData(`/api/authentication/confirmemail`, o, false);
}

function confirmPassword(o) {
    return axios.postData(`/api/authentication/confirmpassword`, o, false);
}

function resetPassword(email) {
    return axios.postData(`/api/authentication/resetpassword?email=${email}`, null, false);
}