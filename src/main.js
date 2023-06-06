import {createApp} from 'vue'
import {createPinia} from "pinia";
import {Client} from "@stomp/stompjs";

import App from './App.vue'
import router from "@/router";
import setupInterceptors from "@/services/setupInterceptors";

setupInterceptors()

createApp(App)
    .use(router)
    .use(createPinia())
    .provide("stompClient", Client)
    .mount('#app');
