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

    getProfile(username){
        if(username){
            return axios.get('/user/profile', {
                params: {
                    username: username
                }
            });
        }
    }

    setProfile(profileInfo){
        if(profileInfo){
            return axios.post('/user/profile',profileInfo)
        }
    }
}

export default new UserService();