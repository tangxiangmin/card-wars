/**
 * 连接mysql
 */
let mysql = require('mysql2/promise');

let connection

try {
    ~(async () => {
        connection = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'happyday',
            database: 'webwar'
        })
        console.log('The mysql is connected!')
    })()
} catch (e) {
    global.logger.error("mysql连接失败", e)
}

module.exports = {
    getConnection() {
        if (!connection) {
            throw Error('no available connection')
        }
        return connection
    }
}
