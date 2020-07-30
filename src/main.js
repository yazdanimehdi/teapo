import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify';
import {SET_CONNECTION} from "@/store/actions/dashboard";
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import axios from "axios";

Vue.config.productionTip = false
const token = localStorage.getItem('user-token');

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
axios.defaults.xsrfCookieName = "csrftoken"

if (token) {
  axios.defaults.headers.common['Authorization'] = `Token ${token}`
}

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App),
  created () {
    window.addEventListener('offline', () => {
      store.dispatch(SET_CONNECTION, false)
    })
    window.addEventListener('online', () => {
      store.dispatch(SET_CONNECTION, true)
    })
  }
}).$mount('#app')

Vue.filter('formatTime', function (d) {
  let value = d.toString()
  return value.length >= 2 ? value : new Array(2 - value.length + 1).join('0') + value;
}) ;
