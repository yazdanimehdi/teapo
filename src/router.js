import Vue from 'vue'
import Router from 'vue-router'
import RegisterLogin from "@/Views/RegisterLogin";
import Dashboard from "@/Views/Dashboard";

import tpoExam from "@/Views/ExamModule/tpoExam";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Dashboard',
            component: Dashboard
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