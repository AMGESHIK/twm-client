import axios from '@/axiosInstance';
import TokenService from "@/services/token.service";

const point = '/auth/'

class AuthService {


    login(user) {
        return axios
            .post(point + 'login', {
                login: user.email,
                password: user.password
            })
            .then(response => {
                if (response.data.jwtResponse.accessToken) {
                    TokenService.setUser(response.data);
                }
                return response.data;
            });
    }

    logout() {
        TokenService.removeUser()
    }

    register(user) {
        return axios.post(point + 'registration', {
            username: user.username,
            email: user.email,
            password: user.password
        });
    }
}

export default new AuthService();