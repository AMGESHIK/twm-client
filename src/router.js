import {createRouter, createWebHistory} from "vue-router";

import LoginPage from "@/components/auth/LoginPage";
import RegistrationPage from "@/components/auth/RegistrationPage";
import DiaryPage from "@/components/diary/DiaryPage";
import AddingProgram from "@/components/diary/AddingProgram";
import programPage from "@/components/diary/ProgramPage";
import EditProgram from "@/components/diary/EditProgram";
import ProfilePage from "@/components/profile/ProfilePage";
import ChatsPage from "@/components/chat/ChatsPage";
import ChatPage from "@/components/chat/ChatPage";
import EditProfile from "@/components/profile/EditProfile";
import newsFeed from "@/components/posts/NewsFeed";
import directoryPage from "@/components/directory/DirectoryPage";

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
        {path:'/profile/:username/edit', component: EditProfile, name:"editProfile"},
        {path: '/chats', component: ChatsPage},
        {path: '/chats/:userId', component: ChatPage, name:"chat"},
        {path: '/news', component: newsFeed},
        {path: '/directory', component: directoryPage}
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