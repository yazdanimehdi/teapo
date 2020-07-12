import Vue from 'vue'
import Router from 'vue-router'
import RegisterLogin from "@/Views/RegisterLogin";
import Dashboard from "@/Views/Dashboard";

import tpoExam from "@/Views/ExamModule/tpoExam";
import LearnNewWords from "@/Views/MemriseModules/LearnNewWords";
import SpeedReview from "@/Views/MemriseModules/SpeedReview";
import Review from "@/Views/MemriseModules/Review";

Vue.use(Router);

export default new Router({
    routes: [
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