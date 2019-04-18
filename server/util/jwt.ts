/**
 * 2019/4/17 下午9:58
 */

let jwt = require("jwt-simple");
let jwtSecret = "web wars";

const Token = {
    encode(params: any) {
        return jwt.encode(params, jwtSecret);
    },
    verify(token: string) {
        let data = jwt.decode(token, jwtSecret);
        let {expires, uid} = data;
        if (expires > Date.now()) {
            return uid
        }
    }
}

export default Token
