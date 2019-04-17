/**
 * 2019/1/26 下午9:16
 */

import io from 'socket.io-client'
import config from '../config'

let socket = io(`http://${location.hostname}:${config.port}`);

let {EVENT} = config
// 心跳
setInterval(() => {
    socket.emit(EVENT.PING);
}, 5000)

socket.on("test", function (data) {
    console.log('listen test from server', data)
})


let client = {
    on(eventName, cb) {
        socket.on(eventName, cb);
    },
    emit(eventName, data) {
        socket.emit(eventName, data);
    },

    close() {
        socket.close(true);
    },

    // 进入房间
    enterRoom(params) {
        socket.emit(EVENT.ENTER_ROOM, params);
    },
    onEnterRoom(cb) {
        socket.on(EVENT.ENTER_ROOM, cb);
    },
    // 离开房间
    onUserLeaveRoom(cb) {
        socket.on(EVENT.LEAVE_ROOM, cb);
    },
    // 放置图片
    putCard(data) {
        socket.emit(EVENT.PUT_CARD, data);
    },

    onPutCard(cb) {
        socket.on(EVENT.PUT_CARD, cb);
    },
    nextRound(data) {
        socket.emit(EVENT.NEXT_ROUND, data);
    },
    onNextRound(cb) {
        socket.on(EVENT.NEXT_ROUND, cb);
    },
    // 聊天
    chat(data) {
        socket.emit(EVENT.SEND_CHAT_MESSAGE, data);
    },
    onChat(cb) {
        socket.on(EVENT.RECEIVE_CHAT_MESSAGE, cb);
    }
}

export default client
