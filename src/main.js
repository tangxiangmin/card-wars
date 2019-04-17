import Vue from 'vue'
import App from './App.vue'

import './assets/common.scss'
// 引入layer-mobile


// import './socket/index'
import router from './router'

Vue.config.productionTip = false
Vue.prototype.$layer = window.layer

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')

