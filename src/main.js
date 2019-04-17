import Vue from 'vue'
import App from './App.vue'

// 引入layer-mobile


import './socket/index'

Vue.config.productionTip = false
Vue.prototype.$layer = window.layer

new Vue({
    render: h => h(App),
}).$mount('#app')

