import axios from './AxiosHelper';

// define public methods
export const userService = {    
    get,
    getById,
    post,
    getUserRoles,
    addRoleToUser,
    deleteRoleFromUser,
    updatePassword,
    deleteUser,
    restoreUser
};

function get(page, pagesize, sorted, keyword, roleid) {
    let url = `/api/user?page=${page}&pagesize=${pagesize}`;

    if(keyword && keyword.length > 0)
        url += "&keyword=" + escape(keyword);

    if(roleid && roleid.length > 0)
            url += "&roleid=" + roleid;

    if(sorted && sorted.id)
        url += "&sort=" + sorted.id + "&desc=" + sorted.desc;

    return axios.getData(url, true);
}

function getById(id) {
    return axios.getData(`/api/user/${id}`, true);
}

function post(data) {
    return axios.upsertData(data.id, `/api/user`, data, true)
}

function getUserRoles(id) {    
    return axios.getData(`/api/user/${id}/roles`, true);
}

function addRoleToUser(userId, roleId, startDate, expiryDate) {
    let data = {
        userId,
        roleId,
        startDate,
        expiryDate
    }

    return axios.postData(`/api/user/${userId}/role`, data, true)
}

function deleteRoleFromUser(userId, roleId) {
    return axios.deleteData(`/api/user/${userId}/role/${roleId}`);
}

function updatePassword(values) {    
    return axios.putData(`/api/user/${values.id}/password`, values, true);
}

function deleteUser(id) {
    return axios.deleteData(`/api/user/${id}`);
}

function restoreUser(id) {
    return axios.putData(`/api/user/${id}/restore`, null, true);
}