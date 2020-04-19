const io = require('socket.io-client');

let sock = io.connect('http://localhost:10100');
sock.on('connect', () => {
    sock.emit('subscribe', 'neworder');
})
sock.on('neworder', data => {
    console.log('neworder', data);
})