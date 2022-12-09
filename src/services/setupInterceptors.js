import axiosInstance from "@/axiosInstance";
import TokenService from "@/services/token.service";
import {useAuthUserStore} from "@/stores";

const setup = () => {


    axiosInstance.interceptors.request.use(
        (config) => {
            const token = TokenService.getLocalAccessToken();
            if (token) {
                config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        (res) => {
            return res;
        },
        async (err) => {
            const originalConfig = err.config;

            if (originalConfig.url !== "/auth/login" && err.response) {
                // Access Token was expired
                if (err.response.status === 401 && !originalConfig._retry) {
                    originalConfig._retry = true;

                    try {
                        const rs = await axiosInstance.post("/auth/token", {
                            refreshToken: TokenService.getLocalRefreshToken(),
                        });
                        const {accessToken} = rs.data;
                        useAuthUserStore().refresh(accessToken);
                        TokenService.updateLocalAccessToken(accessToken);
                        location.reload();
                        return axiosInstance(originalConfig);
                    } catch (_error) {
                        return Promise.reject(_error);
                    }
                }
            }

            return Promise.reject(err);
        }
    );
};

export default setup;