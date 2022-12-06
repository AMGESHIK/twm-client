import axios from '@/axiosInstance';
import authHeader from './authHeader';

const point = '/hello/'

class UserService {
    getPublicContent() {
        return axios.get('/');
    }

    getUserBoard() {
        return axios.get(point + 'user', {headers: authHeader()});
    }

    // getModeratorBoard() {
    //     return axios.get(API_URL + 'mod', {headers: authHeader()});
    // }

    getAdminBoard() {
        return axios.get(point + 'admin', {headers: authHeader()});
    }
}

export default new UserService();