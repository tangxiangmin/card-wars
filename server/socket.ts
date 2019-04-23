import user from "./model/user";

let logger = require('./util/logger')

let config = require('../src/config')
import Token from './util/jwt'

import roomModel from './model/room'
import userModel from './model/user'

import gameController from './controller/game'
import Table, {userInfo} from "./core/table";
import Player from "./core/player";

let {EVENT} = config

export default (server: any) => {
    let io = require('socket.io')(server);

    let uidToSocketId: { [key: string]: number; } = {}
    // 鉴权中间件
    io.use(function (socket: any, next: any) {
        var query = socket.request._query;
        let {token, roomId} = query

        let uid

        if (token && (uid = Token.verify(token))) {
            socket.uid = uid
            socket.roomId = roomId
            uidToSocketId[uid] = socket.id
        }

        next()
    });

    function findSocketByUid(uid: number) {
        let id = uidToSocketId[uid]
        if (id) {
            return io.sockets.connected[id]
        }
    }


    // ====相关事件==== //
    io.on('connect', function (socket: any) {
        if (!socket.uid) {
            socket.emit(EVENT.INVALID_ACCESS_ERR)
            return
        }

        logger.info('socket uid:', socket.uid, '进入房间')

        let uid = socket.uid

        const updateRoomState = (cb: Function) => {
            let table = roomModel.getRoomTable(socket.roomId)

            table.players.forEach((player: Player) => {
                let socket = findSocketByUid(player.uid)
                let state = table.getCurrentState(socket.uid)
                // 向指定客户端发送消息
                cb(socket, state)
            })
        }

        // 断开连接
        socket.on('disconnect', function () {
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
                        // 初始化房间
                        let table = await gameController.initRoom(users)

                        roomModel.setRoomTable(socket.roomId, table)

                        updateRoomState((socket: any, state: any) => {
                            socket.emit(EVENT.GAME_READY, state);
                        })
                    }
                } catch (e) {
                    logger.error(e);
                }
            } else {
                logger.info(`找不到uid为：${uid}的用户信息`);
            }
        });

        // 放置卡片
        socket.on(EVENT.PUT_CARD, function (data: any, callback: Function) {
            logger.info(`放置卡片：${data.pos}`);
            try {
                let table = roomModel.getRoomTable(socket.roomId)

                let {card, pos} = data

                let player = table.currentPlayer

                let targetCard = player.getCardById(card.id)
                player.putCardToTable(targetCard, pos)

                updateRoomState((socket: any, state: any) => {
                    socket.emit(EVENT.TABLE_UPDATE, state);
                })

            } catch (e) {
                logger.error('PUT_CARD error', e)
                callback(e.toString())
            }
        });

        // 通知对手进行下一回合
        socket.on(EVENT.NEXT_ROUND, function (data: any) {
            logger.info(`下一回合开始`);
            let table = roomModel.getRoomTable(socket.roomId)
            let rival = table.getPlayerRival()
            table.newRound(rival)

            let cards = table.getPlayerCards(rival)
            logger.info(cards)

            updateRoomState((socket: any, state: any) => {
                socket.emit(EVENT.TABLE_UPDATE, state);
            })
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
