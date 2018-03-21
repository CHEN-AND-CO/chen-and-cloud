const WS = require('ws');

//Create the server
const websocket = new WS.Server( {
    port: 12345
});
console.log('Server is listening on port ' + websocket.port);

websocket.on('connection', (client) => {
    //New client
    client.send('Bienvenue !');
    console.log('New client connected');

    client.on('message', (data) => {
        //Broadcast to all
        for ( let client in websocket.clients )
        {
            client.send(data);
        }
        //Send the message back to the sender
        client.send(data);

        console.log(data);
    });
});
