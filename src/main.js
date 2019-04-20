import Vue from 'vue'
import App from './App.vue'

import './assets/common.scss'
// 引入layer-mobile


// import './socket/index'
import router from './router'

Vue.config.productionTip = false
Vue.prototype.$layer = window.layer

Vue.prototype.$toast = function (tip) {
    layer.open({
        content: tip
        , skin: 'msg'
        , time: 2 //2秒后自动关闭
    })
}

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')

