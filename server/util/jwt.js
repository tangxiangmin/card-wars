/**
 * 2019/4/17 下午9:58
 */

let jwt = require("jwt-simple");
let jwtSecret = "web wars";

const Token = {
    encode(params) {
        return jwt.encode(params, jwtSecret);
    },
    verify(token) {
        let data = jwt.decode(token, jwtSecret);
        let { expires } = data;
        return expires > Date.now();
    }
}

module.exports = Token
