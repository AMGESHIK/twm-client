import axios from "@/axiosInstance";

class PostService {
    createPost(text, file) {
        let formData = new FormData()
        formData.append("file", file)
        formData.append("text", text)
        return axios.post('/post', formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
    }

    getPosts(count) {
        return axios.get("/post", {
            params: {
                count: count
            }
        })
    }

    getPhoto(id) {
        return axios.get("/post/photo", {
            responseType: "blob",
            params: {
                id: id
            }
        })
    }

    createComment(text, postId){
        return axios.post("/post/comment", {
            postId: postId,
            text: text
        })
    }
}

export default new PostService();