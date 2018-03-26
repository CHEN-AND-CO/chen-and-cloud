const WS = require('ws');

const websocket = new WebSocket('ws://localhost:'+ settings.port);

websocket.on('open', () => {
    websocket.send('Local terminal client connected');
});

websocket.on('message', (data) => {
    console.log(data);
});
