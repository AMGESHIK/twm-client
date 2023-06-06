import axios from '@/axiosInstance';

class ChatsService {
    getChats() {
        return axios.get("/chats");
    }

    getMessages(recipient) {
        return axios.get("/messages", {
            params: {
                recipientId: recipient
            }
        })
    }
}

export default new ChatsService();