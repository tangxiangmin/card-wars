/**
 * 2019/1/26 下午9:16
 */

import io from 'socket.io-client'
import config from '../../server/config'

let socket = io(`http://localhost:${config.port}`);

let {EVENT} = config

let client = {
    on(eventName, cb) {
        socket.on(eventName, cb);
    },
    emit(eventName, data) {
        socket.emit(eventName, data);
    },

    // 进入房间
    enterRoom(uid) {
        socket.emit(EVENT.ENTER_ROOM, {uid});
    },
    onEnterRoom(cb) {
        socket.on(EVENT.ENTER_ROOM, cb);

    },
    // 放置图片
    putCard(data) {
        socket.emit(EVENT.PUT_CARD, data);
    },

    onPutCard(cb) {
        socket.on(EVENT.PUT_CARD, cb);
    },
    // 聊天
    chat(data){
        socket.emit(EVENT.SEND_CHAT_MESSAGE, data);
    },
    onChat(cb){
        socket.on(EVENT.RECEIVE_CHAT_MESSAGE, cb);
    }
}

export default client
