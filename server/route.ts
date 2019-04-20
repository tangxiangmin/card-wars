import * as Router from 'koa-router'

import authController from './controller/auth'
import gameController from './controller/game'

let router = new Router({
    prefix: '/api'
});
router.get('/test', (ctx) => {
    ctx.body = 'hello test 123'
})

router.post('/login', authController.login)

router.use(authController.auth)
router.get('/userInfo', authController.userInfo)
router.post('/createRoom', gameController.createRoom)


export default router


