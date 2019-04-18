/**
 * 2019/4/17 下午9:58
 */

import userModel from '../model/user'
import Token from '../util/jwt'

function login({uid, account, password}: {
    uid: number,
    account: string,
    password: string
}) {
    let expires = Date.now() + 24 * 60 * 60 * 1000;
    const token = Token.encode({uid, account, expires});

    // 设置token
    return {
        uid,
        token
    }
}

export default {
    async auth(ctx: any, next: any) {
        let token = ctx.request.header['x-token'];
        let uid
        if (token && (uid = Token.verify(token))) {
            ctx.uid = uid
            await next()
        } else {
            ctx.body = {
                code: 401,
                message: "token验证失败，请重新登陆"
            }
        }
    },
    async login(ctx: any) {
        let {account, password} = ctx.request.body;

        if (!account || !password) {
            return ctx.body = {
                code: 400,
                message: '参数不完整'
            }
        }

        // 校验账号密码
        let uid = await userModel.checkAccount(account, password)
        // 登录
        if (uid) {
            let result: { uid: number, token: string } = login({uid, account, password})

            ctx.statusCode = 200
            ctx.body = {
                message: '登陆成功',
                data: result
            }
        } else {
            ctx.statusCode = 401
        }
    },

    async userInfo(ctx: any) {
        let user = await userModel.getUserInfoByUid(ctx.uid)
        if (user) {
            ctx.body = {
                message: 'success',
                data: user
            }
        }
    }
}
