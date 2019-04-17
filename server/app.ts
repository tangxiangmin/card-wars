import * as Koa from 'koa';
import router from './route'

const app: Koa = new Koa();


app.use(router.routes()).use(router.allowedMethods());

export default app;
