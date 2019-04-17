import * as Router from 'koa-router'

// import authController from './controller/auth'

let router = new Router({
    prefix: '/api'
});
router.get('/test', (ctx) => {
    ctx.body = 'hello test 123'
})

// router.post('/login', authController.login)

export default router


