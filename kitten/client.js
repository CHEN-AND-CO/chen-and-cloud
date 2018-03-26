const WS = require('ws');

parseArgs();

const websocket = new WebSocket('ws://localhost:'+ settings.port);

websocket.on('open', () => {
    websocket.send('Local terminal client connected');
});

websocket.on('message', (data) => {
    console.log(data);
});

websocket.on('error', () => {
    console.log('Failed to connect to ' + websocket.url);
});


function parseArgs()
{
    //Command line arguments parsing
    for (var i = 2; i < process.argv.length; i++)
    {
        switch (process.argv[i])
        {
            case '-p':
            case '--port':
                settings.port = parseInt(process.argv[i + 1]);
                i++;
                break;

            case '-h':
            case '--help':
                console.log("Small and ready-to-use websocket server. By G. Leroy-Ferrec (HerrCrazi)\nUsage : \n\t-h, --help : Display this help.\n\nServer settings :\n\t-p <port>, --port <port> : Listen on the given <port>.");
                break;

            default:
                console.warn('Unknown argument \'' + process.argv[i] + '\'');
        }
    }
}