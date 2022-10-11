import axios from 'axios';
import { API_HOST_PREFIX, onGlobalError, onGlobalSuccess } from './serviceHelpers';

const userUrl = `${API_HOST_PREFIX}/api/users`;

const register = (payload) => {
    const config = {
        method: 'POST',
        url: userUrl,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const addUserOrgs = (userId, orgId) => {
    const config = {
        method: 'POST',
        url: `${userUrl}/orgs/?userId=${userId}&orgId=${orgId}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const login = (payload) => {
    const config = {
        method: 'POST',
        url: `${userUrl}/login`,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const emailConfirm = (token) => {
    const config = {
        method: 'PUT',
        url: `${userUrl}/confirm/${token}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const currentUser = () => {
    const config = {
        method: 'GET',
        url: `${userUrl}/current`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const logout = () => {
    const config = {
        method: 'GET',
        url: `${userUrl}/logout`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const userService = { register, login, emailConfirm, currentUser, logout, addUserOrgs };

export default userService;
