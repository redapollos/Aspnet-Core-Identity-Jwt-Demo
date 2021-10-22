import axios from './AxiosHelper';

// define public methods
export const roleService = {
    get,
    getById,
    post,
    deleteRole,
    getClaims,
    updateClaims
};

function get() {
    return axios.getData(`/api/role`, true);
}

function getById(id) {
    return axios.getData(`/api/role/${id}`, true);
}

function post(data) {
    return axios.upsertData(data.id, `/api/role`, data, true);
}

function deleteRole(id) {
    return axios.deleteData(`/api/role/${id}`, true);
}

function getClaims() {
    return axios.getData(`/api/role/claims`, true);
}

function updateClaims(roleid, data) {
    return axios.putData(`/api/role/${roleid}/claims`, data, true);
}