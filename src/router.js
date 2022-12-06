import {createRouter, createWebHistory} from "vue-router";

import LoginPage from "@/components/LoginPage";
import RegistrationPage from "@/components/RegistrationPage";
import DiaryPage from "@/components/DiaryPage";
import AddingProgram from "@/components/AddingProgram";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/diary',
            component: DiaryPage,
            // children: [
            //     {
            //         path: 'addProgram',
            //         component: AddingProgram,
            //
            //     }
            // ]
        },
        {path: '', redirect: '/diary'},
        {path: '/', redirect: '/diary'},
        {path: '/diary/addProgram', component: AddingProgram},
        {path: '/auth/login', component: LoginPage},
        {path: '/auth/registration', component: RegistrationPage}

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