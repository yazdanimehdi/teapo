import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

Vue.filter('formatTime', function (d) {
  var value = d.toString();
  return value.length >= 2 ? value : new Array(2 - value.length + 1).join('0') + value;
}) ;
