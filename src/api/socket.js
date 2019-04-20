/**
 * 2019/1/26 下午9:16
 */

import io from 'socket.io-client'
import auth from './auth'

import config from '../config'

let socket = io(`http://${location.hostname}:${config.port}`, {
    query: 'token=' + auth.getToken()
});

let {EVENT} = config
// 心跳
setInterval(() => {
    socket.emit(EVENT.PING);
}, 5000)

// 登录失败
socket.on(EVENT.INVALID_ACCESS_ERR, () => {
    console.log('socket 链接鉴权失败，请重新登录')
    // socket.close(true)
})

// 对外暴露的事件接口
let client = {
    // 基础api
    on(eventName, cb) {
        socket.on(eventName, cb);
    },
    emit(eventName, data) {
        socket.emit(eventName, data);
    },

    close() {
        socket.close(true);
    },
    onClose(cb) {
        socket.on("disconnect", cb)
    },
    // 相关接口
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
    // 房间内两个玩家准备就绪
    onReady(cb) {
        socket.on(EVENT.GAME_READY, cb);
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
