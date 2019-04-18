import * as Koa from 'koa';
import router from './route'
const bodyParser = require('koa-body');

const app: Koa = new Koa();

app.use(bodyParser({
    multipart: true,
    formidable: {
        maxFileSize: 200 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
    }
}));

app.use(router.routes()).use(router.allowedMethods());

export default app;
