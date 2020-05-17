import Vue from 'vue'
import Router from 'vue-router'
import Login from "@/Views/Login";
import RegisterLogin from "@/Views/RegisterLogin";

// import ReadingNormalQuestion from "@/Views/ReadingNormalQuestion";
// import ReadingInsertion from "@/Views/ReadingInsertion";
import tpoExam from "@/Views/tpoExam";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Reading',
            component: tpoExam
        },
        {
            path: '/signup',
            name: 'signup',
            component: RegisterLogin
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
    ]
})