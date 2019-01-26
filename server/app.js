/**
 * 2019/1/26 下午9:12
 */

let config = require('./config')

let httpServer = require('http').createServer(function (req, res) {
    res.writeHead(200);
    res.end("hello");
})

let io = require('socket.io')(httpServer);

httpServer.listen(config.port);

io.on('connection', function (socket) {
    let {EVENT} = config

    socket.on(EVENT.PUT_CARD, function (data) {
        socket.broadcast.emit(EVENT.PUT_CARD, data);
    });
});
