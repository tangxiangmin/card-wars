/**
 * 2019/1/26 下午9:18
 */

const EVENT = {
    PING: 'PING',
    PONG: 'PONG',

    // 游戏
    ENTER_ROOM: 'ENTER_ROOM',
    GAME_READY: 'GAME_READY',
    PUT_CARD: 'PUT_CARD_12',

    NEXT_ROUND: 'NEXT_ROUND',
    LEAVE_ROOM: 'LEAVE_ROOM',

    // 聊天
    SEND_CHAT_MESSAGE: 'SEND_CHAT_MESSAGE',
    RECEIVE_CHAT_MESSAGE: 'RECEIVE_CHAT_MESSAGE',

    // 通用
    INVALID_ACCESS_ERR: 'INVALID_ACCESS_ERR'
}


module.exports = {
    port: 3000,
    EVENT,
}
