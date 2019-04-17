/**
 * 2019/4/17 下午9:58
 */

let userModel = require('../model/user')
let Token = require('../util/token')

function login({uid, account, password}: {
    uid: number,
    account: string,
    password: string
}) {
    let expires = Date.now() + 24 * 60 * 60 * 1000;
    const token = Token.encode({account, password, expires});

    // 设置token
    return {
        uid,
        token
    }
}

export default {
    async login(ctx: any) {
        let {account, password} = ctx.request.body;
        console.log(account, password)

        if (!account || !password) {
            return ctx.body = {
                code: 400,
                message: '参数不完整'
            }
        }

        // 校验账号密码
        let uid = await userModel.checkAccount({account, password})
        console.log(uid)
        // 登录
        if (uid) {
            let result: { uid: number, token: string } = login({uid, account, password})
            // let user = await userModel.getUserInfoByUid(uid)
            console.log(result)
            ctx.statusCode = 200
            ctx.body = {
                message: '登陆成功',
                data: result
            }
        } else {
            ctx.statusCode = 401
        }
    },
}
