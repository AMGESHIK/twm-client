<template>
  <div class="container my-container mt-xl-2">
    <div class="row">
      <Form @submit="findUsers" class="input-group rounded mb-2">
        <Field name="username" class="form-control rounded" placeholder="Поиск" aria-label="Search"
               aria-describedby="search-addon" autocomplete="none"/>
        <button class="input-group-text border-0" id="search-addon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search"
               viewBox="0 0 16 16">
            <path
                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </button>
      </Form>

      <div class="bg-white ">
        <!-- =============================================================== -->
        <!-- member list -->
        <ul class="friend-list">
          <li v-for="chat in chats" :key="chat.id">
            <router-link to="#" @click="$router.push(`/chats/${chat.userId}`)" class="clearfix text-decoration-none">
              <img :src="chat.userPhotoUrl" alt="" class="rounded-circle">
              <div class="friend-name">
                <strong>{{ chat.username }}</strong>
              </div>
              <div class="last-message text-muted">{{ chat.lastMessage.content }}</div>
              <small class="time text-muted">{{ getTimeAgo(chat.lastMessage.timestamp) }}</small>
              <small class="chat-alert label label-danger"></small> <!-- Для количества непрочитанных смс -->
            </router-link>
          </li>
        </ul>
        <ul class="friend-list new-friend-list" v-if="searchResults[0].username!=null">
          <li class="text-center fw-bold" style="pointer-events: none;">
            Начать новый чат:
          </li>
          <li v-for="user in searchResults" :key="user.id">
            <router-link to="#" @click="$router.push(`/chats/${user.id}`)" class="clearfix text-decoration-none">
              <img :src="user.userPhotoUrl" v-if="user.username" alt="" class="rounded-circle">
              <div class="friend-name">
                <strong>{{ user.username }}</strong>
              </div>
              <div class="last-message text-muted">{{ user.name }}</div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// import stompService from "@/services/stomp.service";
import userService from "@/services/user.service";
import {Form, Field} from "vee-validate";
import chatsService from "@/services/chats.service";
import filesService from "@/services/files.service";

export default {
  name: "ChatPage",
  components: {
    Form,
    Field
  },
  data() {
    return {
      chats: [{
        chatId: null,
        userId: null,
        username: null,
        userPhotoUrl: null,
        lastMessage: {
          content: null,
          id: null,
          sender: null,
          timestamp: null,
        },
      }],
      searchResults: [{
        username: null,
        userPhotoUrl: null,
        id: null,
        name: null,
      }]
    }
  },
  created() {
    chatsService.getChats().then(
        response => {
          this.chats = []
          response.data.forEach(
              x => {
                if (x.userId) {
                  filesService.getProfilePhoto(x.userId).then(
                      response => {
                        this.chats.push({
                          chatId: x.chatId,
                          userId: x.userId,
                          username: x.username,
                          userPhotoUrl: URL.createObjectURL(response.data),
                          lastMessage: x.lastMessage
                        })
                        this.chats.sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp)
                      },
                      error => {
                        this.chats.push({
                          chatId: x.chatId,
                          userId: x.userId,
                          username: x.username,
                          userPhotoUrl: null,
                          lastMessage: x.lastMessage
                        })
                        console.log(error)
                      }
                  )
                }

              })
        },
        error => {
          console.log(error)
        }
    )
  },
  mounted() {
    // this.chats.sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp)
  },
  methods: {
    findUsers(username) {
      this.searchResults = [{
        username: null,
        id: null,
        name: null,
      }]
      userService.getAllUsersByUsernameContaining(username.username.trim()).then(
          resp => {
            this.searchResults = []
            resp.data.forEach(
                x => {
                  if (x.id) {
                    filesService.getProfilePhoto(x.id).then(
                        response => {
                          this.searchResults.push({
                            id: x.id,
                            username: x.username,
                            userPhotoUrl: URL.createObjectURL(response.data),
                            name: x.name
                          })
                        },
                        error => {
                          this.searchResults.push({
                            id: x.id,
                            username: x.username,
                            userPhotoUrl: null,
                            name: x.name
                          })
                          console.log(error)
                        }
                    )
                  }

                }
            )
          }
      )
    },
    parseTime(ms) {
      let timeInFormat = new Date(ms)
      let hours = timeInFormat.getHours()
      let minutes = timeInFormat.getMinutes()
      if (hours / 10 < 1)
        hours = '0' + hours
      if (minutes / 10 < 1)
        minutes = '0' + minutes
      return hours + ':' + minutes
    },
    getTimeAgo(timeInMillis) {
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - timeInMillis;

      // Определение интервалов времени в миллисекундах
      const minute = 60 * 1000;
      const hour = 60 * minute;
      const day = 24 * hour;
      const week = 7 * day;
      const month = 30 * day;
      const year = 365 * day;

      // Определение количества прошедшего времени
      if (timeDiff < minute) {
        return 'только что';
      } else if (timeDiff < hour) {
        const minutes = Math.floor(timeDiff / minute);
        return `${minutes} ${this.getRussianWordForm(minutes, 'минуту', 'минуты', 'минут')} назад`;
      } else if (timeDiff < day) {
        const hours = Math.floor(timeDiff / hour);
        return `${hours} ${this.getRussianWordForm(hours, 'час', 'часа', 'часов')} назад`;
      } else if (timeDiff < week) {
        const days = Math.floor(timeDiff / day);
        return `${days} ${this.getRussianWordForm(days, 'день', 'дня', 'дней')} назад`;
      } else if (timeDiff < month) {
        const weeks = Math.floor(timeDiff / week);
        return `${weeks} ${this.getRussianWordForm(weeks, 'неделю', 'недели', 'недель')} назад`;
      } else if (timeDiff < year) {
        const months = Math.floor(timeDiff / month);
        return `${months} ${this.getRussianWordForm(months, 'месяц', 'месяца', 'месяцев')} назад`;
      } else {
        const years = Math.floor(timeDiff / year);
        return `${years} ${this.getRussianWordForm(years, 'год', 'года', 'лет')} назад`;
      }
    },
// Вспомогательная функция для определения правильной формы слова
    getRussianWordForm(number, form1, form2, form5) {
      const absNumber = Math.abs(number);
      const lastDigit = absNumber % 10;
      const lastTwoDigits = absNumber % 100;

      if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return form5;
      } else if (lastDigit === 1) {
        return form1;
      } else if (lastDigit >= 2 && lastDigit <= 4) {
        return form2;
      } else {
        return form5;
      }
    }
  }
}
</script>

<style scoped>
body {
  padding-top: 0;
  font-size: 12px;
  color: #777;
  background: #f9f9f9;
  font-family: 'Open Sans', sans-serif;
  margin-top: 20px;
}

.my-container {
  max-width: 750px;
  padding-top: 10px;
  background-color: #FFF;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
}

.bg-white {
  background-color: #fff;
}

.friend-list {
  list-style: none;
  margin-left: -40px;
}

.friend-list li {
  border-bottom: 1px solid #eee;
}

.friend-list li:hover {
  background-color: #f1f5fc;
}

.new-friend-list li {
  background-color: #f7f7f7;
}

.friend-list li a img {
  float: left;
  width: 45px;
  height: 45px;
  margin-right: 10px;
}

.friend-list li a {
  position: relative;
  display: block;
  padding: 10px;
  transition: all .2s ease;
  -webkit-transition: all .2s ease;
  -moz-transition: all .2s ease;
  -ms-transition: all .2s ease;
  -o-transition: all .2s ease;
}

.friend-list li.active a {
  background-color: #f1f5fc;
}

.friend-list li a .friend-name,
.friend-list li a .friend-name:hover {
  color: #696969;
}

.friend-list li a .last-message {
  width: 65%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.friend-list li a .time {
  position: absolute;
  top: 10px;
  right: 8px;
}

small, .small {
  font-size: 85%;
}

.friend-list li a .chat-alert {
  position: absolute;
  right: 8px;
  top: 27px;
  font-size: 10px;
  padding: 3px 5px;
}
</style>