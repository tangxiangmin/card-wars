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
        // todo 测试数据入库
        let map: any[] = [{
            uid: 1,
            hp: 9,
            cards: [1, 2, 3, 4, 5, 6,],
            userName: 'PlayerA'
        }, {
            uid: 2,
            hp: 12,
            cards: [1, 2, 3, 4, 5, 6,],
            userName: 'PlayerB'
        }, {
            uid: 3,
            hp: 4,
            cards: [1, 2, 3, 4, 5, 6,],
            userName: 'PlayerC'
        }]

        return map[uid]
        // let [rows] = await conn.query(`SELECT id,avatar,nickname,sign,gender,followers,likes,following FROM user WHERE id = ?`, [uid])
        // return rows && rows[0]
    },
}
