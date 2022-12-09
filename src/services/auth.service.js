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

    // token() {
    //     let refreshToken = JSON.parse(localStorage.getItem('user')).refreshToken
    //     return axios
    //         .post(point + 'token', {
    //             refreshToken: refreshToken
    //         })
    //         .then(token => {
    //                 let user = JSON.parse(localStorage.getItem('user'))
    //                 user.accessToken = token.data.accessToken
    //                 localStorage.setItem('user', JSON.stringify(user))
    //                 return token.data.accessToken;
    //             },
    //             (error) => {
    //                 localStorage.removeItem('user')
    //                 return Promise.reject(error)
    //             }
    //         )
    // }

    // refresh() {
    //     let refreshToken = JSON.parse(localStorage.getItem('user')).refreshToken
    //     return axios
    //         .post(point + 'token', {
    //                 refreshToken: refreshToken
    //             }, {
    //                 headers: authHeader()
    //             }
    //         )
    //         .then(token => {
    //                 let user = JSON.parse(localStorage.getItem('user'))
    //                 user.accessToken = token.data.accessToken
    //                 user.refreshToken = token.data.refreshToken
    //                 localStorage.setItem('user', JSON.stringify(user))
    //                 return token.data;
    //             },
    //             (error) => {
    //                 localStorage.removeItem('user')
    //                 return Promise.reject(error)
    //             }
    //         )
    //
    // }

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