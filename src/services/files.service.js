import axios from "@/axiosInstance";

class FilesService {
    getProfilePhoto(id) {
        return axios.get("/user/profile/photo", {
            responseType: 'blob',
            params: {
                id: id
            }
        })
    }

    setProfilePhoto(file) {
        if (file) {
            let formData = new FormData();

            formData.append("file", file);
            return axios.post('user/profile/upload', formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )
        }
    }
}

export default new FilesService();