const io = require('socket.io-client');

let sock = io.connect('http://localhost:10100');
sock.on('connect', () => {
    sock.emit('neworder', {orderid: 1});
    sock.close();
})