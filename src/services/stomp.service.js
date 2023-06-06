import {Stomp} from '@stomp/stompjs';
import SockJS from 'sockjs-client'
import userService from "@/services/user.service";
import axiosInstance from "@/axiosInstance";

class StompService {
    // url = axios.getUri() + "/ws"
    // stompClient = null


    connect(endpoint, options = {}, callback) {
        const sock = new SockJS(axiosInstance.getUri() + endpoint);
        let stompClient = Stomp.over(sock)
        stompClient.connect(options,
            () => {
                userService.getCurrentUserId().then(
                    response => {
                        let currentUserId = response.data
                        return stompClient.subscribe(`/topic/${currentUserId}/queue/messages`,
                            // tick => {
                            //     console.log(JSON.parse(tick.body))
                            //     this.messages.push(JSON.parse(tick.body))
                            // },
                            callback,
                            error => {
                                console.log("error:" + error)
                            });
                    },
                    error => {
                        console.log(error)
                    }
                )
            },
            error => {
                console.log("error " + error);
            });
        return stompClient
    }

    disconnect(stompClient) {
        if (stompClient) {
            stompClient.disconnect();
        }
        console.log("Disconnected")
    }

    sendMessage(stompClient, msg, recipientId) {
        if (msg.trim() !== "") {
            userService.getCurrentUserId().then(
                response => {
                    let currentUserId = response.data

                    const message = {
                        senderId: currentUserId,
                        recipientId: recipientId,
                        content: msg,
                    };

                    stompClient.send("/app/chat", {}, JSON.stringify(message));
                },
                error => {
                    console.log(error)
                }
            )
        }
    }
}

export default new StompService();