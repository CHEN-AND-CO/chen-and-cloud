const WS = require('ws');   //Require the websocket module
const fileio = require('fs');

var settings = {
    debug: true,            //If true, some info such as received messages will be printed.
    checkInjection: false,  //Check for user injection of code in a message
    port: 12345,            //The port to use
    log: false,             //To log or not to log
    logfile: './history.log'  //The file where the conversation will be logged
};

//Parse command-line arguments
parseArgs();


//Create the websocket server
const websocket = new WS.Server( {
    port: settings.port
});

if (settings.debug) console.log('Server is listening on port ' + settings.port);

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

function parseArgs()
{
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

            case '-h':
            case '--help':
                console.log("Small and ready-to-use websocket server. By G. Leroy-Ferrec (HerrCrazi)\nUsage : \n\t-h, --help : Display this help.\n\nServer settings :\n\t-p <port>, --port <port> : Listen on the given <port>.\n\t-c, --check-injection : Check each incoming message for injections of code.\n\nDebugging :\n\t-q, --quiet : Use quiet mode, nothing will be printed on the standard output during execution.\n\t-v, --verbose : Use verbose mode. Informations about the server and incoming messages will be printed on the standard output.\n\nLogging :\n\t-l, --log : Use logging. Any message will be logged in <logfile> (default : 'history.log', set it with --logfile).\n\t--logfile <file> : Set the file used for keeping the log if logging is activated (see -l, --log). If the file does not exists, it will be created. Warning ! The current working directory will be used, i.e. the directory from which you're running the script, not necesarily the directory where the script is really.");
                break;
            
            default:
                console.warn('Unknown argument \''+process.argv[i]+'\'');    
        }
    }
}