import Vue from 'vue'
import Router from 'vue-router'
import Login from "@/Views/Login";
import Signup from "@/Views/Signup";

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
            component: Signup
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
    ]
})