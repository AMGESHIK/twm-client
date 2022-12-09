import axios from '@/axiosInstance';

const point = '/hello/'

class UserService {
    getPublicContent() {
        return axios.get('/');
    }

    getUserBoard() {
        return axios.get(point + 'user');
    }

    // getModeratorBoard() {
    //     return axios.get(API_URL + 'mod', {headers: authHeader()});
    // }

    getAdminBoard() {
        return axios.get(point + 'admin');
    }
}

export default new UserService();