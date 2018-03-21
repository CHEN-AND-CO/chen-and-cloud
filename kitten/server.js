const WS = require('ws');

//Create the server
const websocket = new WS.Server( {
    port: 12345
});

console.log('Server is listening on port 12345');

websocket.on('connection', (client) => {
    //New client
    client.send('Bienvenue !');
    console.log('New client connected');

    client.on('message', (data) => {
        //Broadcast to all
        websocket.clients.forEach( (client) => {

            if ( client.readyState = WS.OPEN )
                client.send(data);
        });

        console.log(data);
    });
});
