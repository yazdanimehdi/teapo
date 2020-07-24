import Vue from 'vue'
import Router from 'vue-router'
import RegisterLogin from "@/Views/RegisterLogin";
import Dashboard from "@/Views/Dashboard";

import tpoExam from "@/Views/ExamModule/tpoExam";
import LearnNewWords from "@/Views/MemriseModules/LearnNewWords";
import SpeedReview from "@/Views/MemriseModules/SpeedReview";
import Review from "@/Views/MemriseModules/Review";
import DifficultWords from "@/Views/MemriseModules/DifficultWords";

Vue.use(Router);

export const router = new Router({
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: RegisterLogin
        },
        {
            path: '/',
            name: 'Dashboard',
            component: Dashboard
        },

        {
            path: '/learn_words',
            name: 'NewWords',
            component: LearnNewWords
        },

        {
            path: '/speed_review',
            name: 'SpeedReview',
            component: SpeedReview
        },

        {
            path: '/review',
            name: 'Review',
            component: Review
        },

        {
            path: '/difficult_words',
            name: 'DifficultWords',
            component: DifficultWords
        },

        {
            path: '/tpo',
            name: 'TPOExam',
            component: tpoExam
        },
        {
            path: '/register_login',
            name: 'RegisterLogin',
            component: RegisterLogin
        },

    ]
})

router.beforeEach((to, from, next) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/login'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('user-token');

    if (authRequired && !loggedIn) {
        return next('/login');
    }
    next();
})