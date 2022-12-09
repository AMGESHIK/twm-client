import {createApp} from 'vue'
import {createPinia} from "pinia";

import App from './App.vue'
import router from "@/router";
import setupInterceptors from "@/services/setupInterceptors";

setupInterceptors()

createApp(App)
    .use(router)
    .use(createPinia())
    .mount('#app');
