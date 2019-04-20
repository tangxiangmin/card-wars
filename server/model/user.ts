/**
 * 2019/4/17 下午10:37
 */

let mysql = require('./mysql')



export default {
    async checkAccount(account: string, password: string) {
        let conn = await mysql.getConnection()
        let [rows] = await await conn.query(`SELECT id FROM user WHERE account = ? AND password = ?`, [account, password])
        return rows[0] && rows[0].id
    },
    async getUserInfoByUid(uid: number) {
        let conn = await mysql.getConnection()
        let [rows] = await conn.query(`SELECT id,username,hp,cards FROM user WHERE id = ?`, [uid])
        return rows && rows[0]
    },
}
