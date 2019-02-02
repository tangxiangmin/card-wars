/**
 * 2019/1/26 下午9:12
 */

let config = require('./config')
let model = require('./model')

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'info';

// ====启动服务器==== //
let httpServer = require('http').createServer(function (req, res) {
    res.writeHead(200);
    res.end("hello");
})

let io = require('socket.io')(httpServer);
httpServer.listen(config.port);


// ====相关事件==== //
io.on('connection', function (socket) {
    let {EVENT} = config

    socket.on('disconnect', function (from) {
        logger.info(`${from},离开房间`);
    });


    // 进入房间
    socket.on(EVENT.ENTER_ROOM, function (data) {
        let {uid, roomId} = data
        let userInfo = model.getUserInfo(uid)
        if (userInfo) {
            try {
                model.addRoomPlayer(roomId, userInfo)
                let users = model.getRoomPlayers(roomId)

                io.sockets.emit(EVENT.ENTER_ROOM, users);

                logger.info(`uid为：${uid}进入房间${roomId}`);
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
    socket.on(EVENT.SEND_CHAT_MESSAGE, function (data) {
        io.sockets.emit(EVENT.RECEIVE_CHAT_MESSAGE, data);
    });

    socket.on(EVENT.PING, function (data) {
        io.sockets.emit(EVENT.PONG, data);
    });
});
