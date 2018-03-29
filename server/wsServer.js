let http = require('http');
let fs = require('fs');

let server = http.createServer((req, res) => {
    //打开默认页面
    fs.readFile(__dirname + '/index.html', (err, data) => {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }

        res.writeHead(200);
        res.end(data);
    });
});

server.listen(8888, () => {
    console.log('Listen http://localhost:8888');
});

let io = require('socket.io')(server); 

// socket请求处理
io.on('connection',  (socket) => {

    socket.emit('news', {
        msg: '连接成功'
    });

    // 创建自定义事件 message
    socket.on('add-message', function (data) {
        console.log(data);
        io.sockets.emit('message', data);
    });
});