import Vue from 'vue'
import Router from 'vue-router'
import RegisterLogin from "@/Views/RegisterLogin";
import Dashboard from "@/Views/Dashboard";

import tpoExam from "@/Views/ExamModule/tpoExam";
import LearnNewWords from "@/Views/MemriseModules/LearnNewWords";
import SpeedReview from "@/Views/MemriseModules/SpeedReview";
import Review from "@/Views/MemriseModules/Review";
import DifficultWords from "@/Views/MemriseModules/DifficultWords";
import TPOPage from "@/Views/TPOPage";
import ExamReview from "@/Views/ExamModule/ExamReview";

Vue.use(Router);

export default new Router({
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
            path: '/review_words',
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
        {
            path: '/tpo_page',
            name: 'TPOPage',
            component: TPOPage
        },
        {
            path: '/review',
            name: 'ReviewExam',
            component: ExamReview
        },

    ]
})