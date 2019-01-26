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

    putCard(data) {
        socket.emit(EVENT.PUT_CARD, data);
    },

    onPutCard(cb) {
        socket.on(EVENT.PUT_CARD, cb);
    }
}

export default client
