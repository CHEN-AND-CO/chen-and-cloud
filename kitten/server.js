const WS = require('ws');   //Require the websocket module
const fileio = require('fs');

var settings = {
    debug: true,            //If true, some info such as received messages will be printed.
    checkInjection: false,  //Check for user injection of code in a message
    port: 12345,            //The port to use
    log: false,             //To log or not to log
    logfile: './history.log'  //The file where the conversation will be logged
};

//Command line arguments parsing
for (var i=2 ; i < process.argv.length ; i++)
{
    switch (process.argv[i])
    {
        case '-v':
        case '--verbose':
            settings.debug = true;
            break;
        
        case '-q':
        case '--quiet':
            settings.debug = false;
            break;
        
        case '-p':
        case '--port':
            settings.port = parseInt(process.argv[i+1]);
            i++;
            break;
        
        case '-c':
        case '--check-injection':
            settings.checkInjection = true;
            break;

        case '-l':
        case '--log':
            settings.log = true;
            break;

        case '--logfile':
            settings.logfile = process.argv[i+1];
            i++;
        
        default:
            console.warn('Unknown argument \''+process.argv[i]+'\'');    
	}
}


//Create the websocket server
const websocket = new WS.Server( {
    port: 12345
});

if (settings.debug) console.log('Server is listening on port 12345');

websocket.on('connection', (client) => {
    //New client
    client.send('Bienvenue !');
    if (settings.debug) console.log('New client connected');

    client.on('message', (data) => {
        //Broadcast to all
        websocket.clients.forEach( (client) => {
            //Check if this Client is still online and connected
            if ( client.readyState = WS.OPEN )
                client.send(data);
        });

        if (settings.debug) console.log(data);
        if (settings.log) log(data);
    });
});


function log(data)
{
    fileio.appendFile(settings.logfile, data + '\n', () => {});
}