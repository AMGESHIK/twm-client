import {createRouter, createWebHistory} from "vue-router";

import LoginPage from "@/components/LoginPage";
import RegistrationPage from "@/components/RegistrationPage";
import DiaryPage from "@/components/DiaryPage";
import AddingProgram from "@/components/AddingProgram";
import programPage from "@/components/ProgramPage";
import EditProgram from "@/components/EditProgram";
import ProfilePage from "@/components/ProfilePage";
import ChatsPage from "@/components/ChatsPage";
import ChatPage from "@/components/ChatPage";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/diary', component: DiaryPage},
        {path: '', redirect: '/diary'},
        {path: '/', redirect: '/diary'},
        {path: '/diary/addProgram', component: AddingProgram},
        {path: '/diary/program/:programId', component: programPage, name:"program"},
        {path: '/diary/editProgram/:programId', component: EditProgram, name:"editProgram"},
        {path: '/auth/login', component: LoginPage},
        {path: '/auth/registration', component: RegistrationPage},
        {path:'/profile/:username', component: ProfilePage, name:"profile"},
        {path: '/chats', component: ChatsPage},
        {path: '/chats/:userId', component: ChatPage, name:"chat"}
    ]
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/auth/login', '/auth/registration', '/diary'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('user');

    // trying to access a restricted page + not logged in
    // redirect to login page
    if (authRequired && !loggedIn) {
        next('/auth/login');
    } else {
        next();
    }
});

export default router;