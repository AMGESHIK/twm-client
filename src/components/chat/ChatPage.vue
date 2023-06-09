<template>
  <section class="my-container container shadow">
    <div class="chat">
      <div class="header-chat" @click="goToProfile" style="cursor: pointer;">
        <i class="icon fa fa-user-o" aria-hidden="true"></i>
        <img :src="recipientPhotoUrl" style="height: 45px; width: 45px; object-fit: cover;" alt="" class="rounded-circle">
        <p class="name">{{ recipientName }}</p>
        <i class="icon clickable fa fa-ellipsis-h right" aria-hidden="true"></i>
      </div>
      <div class="messages-chat">
        <div v-for="message in messages" :key="message.id" class="message">
          <div :class="{response: message.sender!=$route.params.userId}">
            <p class="text">{{ message.text }} <span class="time"> {{ parseTime(message.time) }}</span></p>
          </div>
        </div>
      </div>
      <div class="footer-chat">
        <i class="icon fa fa-smile-o clickable" style="font-size:25pt;" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-emoji-smile"
               viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path
                d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"/>
          </svg>
        </i>
        <input v-model="inputMessage" @keydown.enter="sendMessage" type="text" class="write-message"
               placeholder="Type your message here">
        <i @click="sendMessage" class="icon send clickable" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send"
               viewBox="0 0 16 16">
            <path
                d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
          </svg>
        </i>
      </div>
    </div>
  </section>
</template>

<script>
// import StompService from "@/services/stomp.service";
import chatsService from "@/services/chats.service";
import {useStompStore} from "@/stores/stomp.store";
import {useAuthUserStore} from "@/stores";
import userService from "@/services/user.service";
import filesService from "@/services/files.service";
// import {watch} from "vue";

export default {
  name: "ChatPage",
  setup() {
    const stompStore = useStompStore();
    const authStore = useAuthUserStore();
    return {stompStore, authStore}
  },
  data() {
    return {
      recipientName: null,
      recipientPhotoUrl: null,
      messages: [{
        id: null,
        sender: null,
        time: null,
        text: null,
      }],
      inputMessage: null,
    }
  },
  created() {
    userService.getUsernameById(this.$route.params.userId).then(
        response => {
          this.recipientName = response.data
        },
        error => {
          console.log(error)
        }
    )
    chatsService.getMessages(this.$route.params.userId).then(
        response => {
          if (response.data.length > 0) {
            this.messages = []
            response.data.forEach(
                msg => {
                  this.messages.push({
                    id: msg.id,
                    sender: msg.sender,
                    time: msg.timestamp,
                    text: msg.content
                  })
                }
            )
          }
        },
        error => {
          console.log(error)
        }
    )
    filesService.getProfilePhoto(this.$route.params.userId).then(
        response => {
          this.recipientPhotoUrl = URL.createObjectURL(response.data)
        },
        error => {
          console.log(error)
        }
  )
  },
  mounted() {

  },
  methods: {
    sendMessage() {
      this.stompStore.sendMessage(this.inputMessage, this.$route.params.userId)
      this.messages.push({
        id: Date.now(),
        sender: this.authStore.userInfo.id,
        time: Date.now(),
        text: this.inputMessage
      })
      this.inputMessage = null
    },
    parseTime(time) {
      let timeInFormat = new Date(time)
      let hours = timeInFormat.getHours()
      let minutes = timeInFormat.getMinutes()
      if (hours / 10 < 1)
        hours = '0' + hours
      if (minutes / 10 < 1)
        minutes = '0' + minutes
      return hours + ':' + minutes
    },
    goToProfile(){
      this.$router.push(`/profile/`+this.recipientName)
    }
  },
  watch: {
    newMessages: {
      handler(newValue) {
        console.log("Зашли в watch")
        console.log(newValue)
        if (newValue.length > 0 && newValue[newValue.length - 1].sender == this.$route.params.userId) {
          let msg = newValue[newValue.length - 1]
          this.messages.push({
            id: msg.id,
            sender: msg.sender,
            time: msg.time,
            text: msg.text
          })
        }
      },
      deep: true
    }
  },
  computed: {
    newMessages() {
      return this.stompStore.getMessages
    }
  }

}
</script>

<style scoped>
body {
  padding: 5%;
  background-color: #F5F5F5;
}

.my-container {
  max-width: 750px;
  padding: 0;
  background-color: #FFF;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  height: calc(100vh - 65px);
}

.discussions .discussion .name {
  margin: 0 0 0 20px;
  /*font-family: 'Montserrat', sans-serif;*/
  font-size: 11pt;
  color: #515151;
}

.discussions .discussion .message {
  margin: 6px 0 0 20px;
  /*font-family: 'Montserrat', sans-serif;*/
  font-size: 9pt;
  color: #515151;
}

.chat {
  /*width: calc(65% - 85px);*/
  position: relative;
  height: 100%;
}

.header-chat {
  background-color: #FFF;
  height: 60px;
  box-shadow: 0px 3px 2px rgba(0, 0, 0, 0.100);
  display: flex;
  align-items: center;
}

.chat .header-chat .icon {
  margin-left: 30px;
  color: #515151;
  font-size: 14pt;
}

.chat .header-chat .name {
  margin: 0 0 0 20px;
  text-transform: uppercase;
  /*font-family: 'Montserrat', sans-serif;*/
  font-size: 13pt;
  color: #515151;
}

.chat .header-chat .right {
  position: absolute;
  right: 40px;
}

.chat .messages-chat {
  padding: 25px 0;
  height: 80%;
  overflow-y: scroll;
}

.chat .messages-chat .message {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  /*max-width: 700px;*/

}

.chat .messages-chat .message .photo {
  display: block;
  width: 45px;
  height: 45px;
  background: #E6E7ED;
  -moz-border-radius: 50px;
  -webkit-border-radius: 50px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.chat .messages-chat .text {
  margin: 0 35px;
  background-color: #f6f6f6;
  padding: 15px;
  border-radius: 12px;
  max-width: 500px;
}


.time {

  font-size: 10px;
  color: lightgrey;
  display: block;
  text-align: right;
  margin: -2px 0 -12px 0;
}


.response {
  float: right;
  margin-right: 0px !important;
  margin-left: auto; /* flexbox alignment rule */
}

.response .text {
  background-color: #e3effd !important;
}

.footer-chat {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  bottom: 0;
  background-color: white;
  border-top: 2px solid #EEE;

}

.chat .footer-chat .icon {
  margin-left: 50px;
  color: #C0C0C0;
  font-size: 14pt;
}

.chat .footer-chat .send {
  color: #fff;
  background-color: #4f6ebd;
  position: absolute;
  line-height: 0px;
  right: 50px;
  padding: 12px 12px 12px 12px;
  border-radius: 50px;
  font-size: 14pt;
}

.chat .footer-chat .name {
  margin: 0 0 0 20px;
  text-transform: uppercase;
  /*font-family: 'Montserrat', sans-serif;*/
  font-size: 13pt;
  color: #515151;
}

.chat .footer-chat .right {
  position: absolute;
  right: 40px;
}

.write-message {
  border: none !important;
  width: 80%;
  height: 50px;
  margin-left: 20px;
  padding: 10px;
}

.footer-chat *::-webkit-input-placeholder {
  color: #C0C0C0;
  font-size: 13pt;
}

.footer-chat input *:-moz-placeholder {
  color: #C0C0C0;
  font-size: 13pt;
}

.footer-chat input *::-moz-placeholder {
  color: #C0C0C0;
  font-size: 13pt;
  margin-left: 5px;
}

.footer-chat input *:-ms-input-placeholder {
  color: #C0C0C0;
  font-size: 13pt;
}

.clickable {
  cursor: pointer;
}
</style>