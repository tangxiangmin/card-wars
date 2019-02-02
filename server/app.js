/**
 * 2019/1/26 下午9:12
 */

let config = require('./config')
let model = require('./model')

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'info';


let httpServer = require('http').createServer(function (req, res) {
    res.writeHead(200);
    res.end("hello");
})

let io = require('socket.io')(httpServer);

httpServer.listen(config.port);

io.on('connection', function (socket) {
    let {EVENT} = config

    socket.on('disconnect', function (from) {
        logger.info(`${from},离开房间`);
    });


    // 进入房间
    socket.on(EVENT.ENTER_ROOM, function (data) {
        let {uid, roomId} = data
        let userInfo = model.getUserInfo(uid)

        logger.info(`uid为：${uid}进入房间`);

        socket.broadcast.emit(EVENT.ENTER_ROOM, userInfo);
        socket.emit(EVENT.ENTER_ROOM, userInfo);
    });

    // 放置卡片
    socket.on(EVENT.PUT_CARD, function (data) {
        socket.broadcast.emit(EVENT.PUT_CARD, data);
    });

    // 聊天消息
    socket.on(EVENT.SEND_CHAT_MESSAGE, function (data) {
        io.sockets.emit(EVENT.RECEIVE_CHAT_MESSAGE, data);
    });
});
