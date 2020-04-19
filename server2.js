const http = require('http');

const handler = (req, res) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
        if (data) data = JSON.parse(data);
        if (req.url === '/') {
            res.writeHead(200);
            res.end('Hello world!');
        } else {
            res.writeHead(404);
            res.end('Not found', 'utf-8');
        }
    });
}

const server = http.createServer(handler);

const clientMap = {}
const io = require('socket.io')(server);
io.on('connect', sock => {
    sock.on('subscribe', data => {
        if(data === 'neworder') {
            if(!clientMap['neworder']) clientMap['neworder'] = [];
            clientMap['neworder'].push(sock.id);
        }
    });
    sock.on('neworder', data => {
        for(let id of clientMap['neworder']) {
            sock.to(id).emit('neworder', data);
        }
    });
    sock.on('disconnect', () => {
        for(let t in clientMap) {
            if(clientMap[t].includes(sock.id)) clientMap[t] = clientMap[t].filter(f => f !== sock.id);
        }
    });
});

server.listen(10100);