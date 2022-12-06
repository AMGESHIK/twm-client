import AuthService from '../services/auth.service';
import {defineStore} from "pinia";

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
    ? {status: {loggedIn: true}, user}
    : {status: {loggedIn: false}, user: null};

export const useAuthUserStore = defineStore('authUser', {
    state: () => (initialState),
    actions: {
        login(user) {
            return AuthService.login(user).then(
                user => {
                    this.status.loggedIn = true;
                    this.user = user;
                    return Promise.resolve(user);
                },
                error => {
                    this.status.loggedIn = false;
                    this.user = null;
                    return Promise.reject(error);
                }
            );
        },
        token(){
            return AuthService.token().then(
                accessToken =>{
                    this.user.accessToken = accessToken;
                    return Promise.resolve(accessToken);
                },
                error => {
                    this.status.loggedIn = false;
                    this.user = null;
                    return Promise.reject(error);
                }
            )
        },

        refresh(){
            return AuthService.refresh().then(
                user =>{
                    this.user.accessToken = user.accessToken;
                    this.user.refreshToken=user.refreshToken;
                    return Promise.resolve(user);
                },
                error => {
                    this.status.loggedIn = false;
                    this.user = null;
                    return Promise.reject(error);
                }
            )
        },

        logout() {
            AuthService.logout();
            this.status.loggedIn = false;
            this.user=null;
        },
        register(user) {
            return AuthService.register(user).then(
                response => {
                    this.status.loggedIn = false;
                    return Promise.resolve(response.data);
                },
                error => {
                    this.status.loggedIn = false;
                    return Promise.reject(error);
                }
            );
        },
    }
});