/**
 * 2019/1/26 下午9:18
 */

const EVENT = {
    PING: 'PING',
    PONG: 'PONG',
    
    // 游戏
    ENTER_ROOM: 'ENTER_ROOM',
    PUT_CARD: 'PUT_CARD_12',

    NEXT_ROUND: 'NEXT_ROUND',
    LEAVE_ROOM: 'LEAVE_ROOM',

    // 聊天
    SEND_CHAT_MESSAGE: 'SEND_CHAT_MESSAGE',
    RECEIVE_CHAT_MESSAGE: 'RECEIVE_CHAT_MESSAGE',
}

module.exports = {
    port: 8079,
    EVENT,
}
