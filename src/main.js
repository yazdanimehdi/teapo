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

axios.defaults.baseURL = 'http://127.0.0.1:8000'

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
});

Vue.filter('formatCurrency', function (d) {
  let currency = d.toString()
  let returnString = '';
  let firstComma = currency.length%3
  for(let i=0; i < currency.length; i++){
    if(i%3 === firstComma && i !== 0){
      returnString += ',' + currency[i]
    }
    else {
      returnString += currency[i]
    }
  }
  return returnString
})
Vue.filter('formatDate', function (d){
  return `${new Date(d).getFullYear()}/${new Date(d).getMonth()}/${new Date(d).getDate()}`
});
