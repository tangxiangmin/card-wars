/**
 * 2019/4/17 下午8:48
 */

import Router from 'vue-router'
import Vue from 'vue'

Vue.use(Router)

import Login from '../pages/login'
import Index from '../pages/index'
import Game from '../pages/game/index'

const routes = [
    {path: '/login', component: Login},
    {path: '/', component: Index},
    {path: '/game', component: Game},
]

export default new Router({
    routes
})
