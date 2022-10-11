import axios from 'axios';
import { API_HOST_PREFIX, onGlobalError, onGlobalSuccess } from './serviceHelpers';

const userUrl = `${API_HOST_PREFIX}/api/dashboard/analytics`;

const createAnalytics = (payload) => {
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

const googleAnalytics = { createAnalytics };

export default googleAnalytics;
