import {defineStore} from "pinia";
import StompService from "@/services/stomp.service";

export const useStompStore = defineStore('stomp', {
    state: () => {
        return {
            stompClient: null,
            messages: []
        }
    },
    getters: {
        getMessages(state) {
            return state.messages
        }
    },
    actions: {
        connect(endpoint, options = {}) {
            this.stompClient = StompService.connect(endpoint, options, tick => {
                let msg = JSON.parse(tick.body)
                console.log(msg)
                this.messages.push({
                    id: msg.id,
                    sender: msg.sender,
                    time: msg.timestamp,
                    text: msg.content
                })

            })
        },
        disconnect() {
            StompService.disconnect(this.stompClient)
        },
        sendMessage(msg, recipientId) {
            StompService.sendMessage(this.stompClient, msg, recipientId)
        }

    }
})