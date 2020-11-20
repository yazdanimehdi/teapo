import Vue from 'vue'
import Router from 'vue-router'
import RegisterLogin from "@/Views/RegisterLogin";
import Dashboard from "@/Views/Dashboard";

import tpoExam from "@/Views/ExamModule/tpoExam";
import LearnNewWords from "@/Views/MemriseModules/LearnNewWords";
import SpeedReview from "@/Views/MemriseModules/SpeedReview";
import Review from "@/Views/MemriseModules/Review";
import DifficultWords from "@/Views/MemriseModules/DifficultWords";
import ExamReview from "@/Views/ExamModule/ExamReview";
import OrderDetailPage from "@/Views/OrderDetailPage";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: RegisterLogin
        },
        {
            path: '/order_detail',
            name: 'OrderDetail',
            component: OrderDetailPage
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
            path: '/review',
            name: 'ReviewExam',
            component: ExamReview
        },

    ]
})