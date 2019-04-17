/**
 * 2019/1/26 下午9:12
 */

require('./logger')

let path = require('path')

let config = require('./config')
let model = require('./model')

let express = require('express');
let app = express()
let server = require('http').createServer(app);

// ====启动服务器==== //
server.listen(config.port, () => {
    console.log('Server listening at port %d', config.port);
});
app.use(express.static(path.resolve(__dirname, '../dist/')));

let io = require('socket.io')(server);

// ====相关事件==== //
io.on('connect', function (socket) {
    let {EVENT} = config

    socket.on('disconnect', function (from) {
        let {user} = socket
        logger.info(`${user.userName}离开房间`);

        socket.broadcast.emit(EVENT.LEAVE_ROOM, {
            user: socket.user
        });
    });

    // 进入房间
    socket.on(EVENT.ENTER_ROOM, function (data) {
        let {uid, roomId} = data
        let userInfo = model.getUserInfo(uid)
        if (userInfo) {
            socket.user = userInfo
            try {
                model.addRoomPlayer(roomId, userInfo)
                let users = model.getRoomPlayers(roomId)
                if (users.length <= 2) {
                    logger.info(`uid为：${uid}进入房间${roomId}`);
                    io.emit(EVENT.ENTER_ROOM, users);
                } else {
                    logger.info(`uid为：${uid}进入房间${roomId}，房间人数超过限制,users：${users}`);
                }
            } catch (e) {
                logger.error(e)
            }

        } else {
            logger.info(`找不到uid为：${uid}的用户信息`);
        }
    });

    // 放置卡片
    socket.on(EVENT.PUT_CARD, function (data) {
        logger.info(`放置卡片：${data.pos}`);
        socket.broadcast.emit(EVENT.PUT_CARD, data);
    });

    // 通知对手进行下一回合
    socket.on(EVENT.NEXT_ROUND, function (data) {
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
