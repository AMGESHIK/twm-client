import axios from '@/axiosInstance';


class UserService {
    getCurrentUserId() {
        return axios.get('/user/current')
    }

    getUsernameById(id) {
        return axios.get('/user/usernameById', {
            params: {
                id: id,
            }
        })
    }

    getAllUsersByUsernameContaining(username) {
        if (username) {
            return axios.get('/user/searchUsers', {
                params: {
                    username: username
                }
            });
        }
        return null;
    }
}

export default new UserService();