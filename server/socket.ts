import user from "./model/user";

let logger = require('./util/logger')

let config = require('../src/config')
import Token from './util/jwt'

import roomModel from './model/room'
import userModel from './model/user'

let {EVENT} = config

export default (server: any) => {
    let io = require('socket.io')(server);

    // 鉴权中间件
    io.use(function (socket: any, next: any) {
        var query = socket.request._query;
        let token = query.token
        let uid

        if (uid = Token.verify(token)) {
            socket.uid = uid
        }

        next()
    });

    // ====相关事件==== //
    io.on('connect', function (socket: any) {
        if (!socket.uid) {
            socket.emit(EVENT.INVALID_ACCESS_ERR)
            return
        }

        logger.info('socket uid:', socket.uid, '进入房间')

        let uid = socket.uid
        // 断开连接
        socket.on('disconnect', function () {
            // let {user} = socket
            logger.info(`${socket.uid}离开房间`);

            socket.broadcast.emit(EVENT.LEAVE_ROOM, {
                user: socket.user
            });
        });

        // 进入房间
        socket.on(EVENT.ENTER_ROOM, async function (data: any) {
            let {roomId} = data

            let userInfo = await userModel.getUserInfoByUid(uid)
            if (userInfo) {
                socket.user = userInfo
                try {
                    roomModel.addUserToRoom(roomId, userInfo)
                    let users = roomModel.getRoomUsers(roomId)

                    if (users.length === 2) {
                        io.emit(EVENT.GAME_READY, users);
                    }
                } catch (e) {
                    logger.error(e);
                }
            } else {
                logger.info(`找不到uid为：${uid}的用户信息`);
            }
        });

        // 放置卡片
        socket.on(EVENT.PUT_CARD, function (data: any) {
            logger.info(`放置卡片：${data.pos}`);
            socket.broadcast.emit(EVENT.PUT_CARD, data);
        });

        // 通知对手进行下一回合
        socket.on(EVENT.NEXT_ROUND, function (data: any) {
            logger.info(`下一回合开始`);
            socket.broadcast.emit(EVENT.NEXT_ROUND, data);
        });

        // ===辅助功能=== //
        // 聊天消息
        // socket.on(EVENT.SEND_CHAT_MESSAGE, function (data) {
        //     io.sockets.emit(EVENT.RECEIVE_CHAT_MESSAGE, data);
        // });
        //
        // socket.on(EVENT.PING, function (data) {
        //     io.sockets.emit(EVENT.PONG, data);
        // });
    });
}
