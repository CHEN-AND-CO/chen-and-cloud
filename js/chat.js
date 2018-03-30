var username = ('#' + Math.floor(Math.random() * 999999).toString(16)); //Génére un identifiant aléatoire
var websocket;

/*
initChat(login)
Initialise le chat, connecte le websocket et gére les différents événements
*/
function initChat(login)
{
    //Création du websocket.
    websocket = new WebSocket('ws://' + window.location.hostname + ':12345');

    if ( login != undefined ) username = login; //Utilise le login s'il est fourni

    /*BONUS EXCLUSIF DE LA MAISON : Une fonctionnalité ergonomique et bien pratique 
    permettant de pourrir la vie des autres utilisateurs en toute beauté. En plus c'est
    gratuit ! Pourquoi se gêner ?*/
    var spamString = "LE PHP TUE";  //Message à spammer
    var toggleSpam = false;
    var spammer;

    //Quand le websocket se connecte, on envoie un petit message de notification
    websocket.onopen = () => {
        console.log("Websocket connected.");
        websocket.send("<i>" + username + " s'est connecté</i>");
    };

    //En cas d'erreur de connection
    websocket.onerror = function (er) {
        console.error("Unable to open websocket connection on " + websocket.url);
        $('#chat ul.msg-list').html('<div class="text-alert">Service non disponible</div>');
    }

    //Lors de la réception d'un message, l'afficher, et scroller la liste des messages
    websocket.onmessage = (event) => {
        $('#chat ul.msg-list').append('<li class="message">' + event.data + '</li>');

        $("#chat ul.msg-list").finish();    //Termine de précédentes animations (pour éviter des glitches)
        $("#chat ul.msg-list").animate({ scrollTop: $('#chat ul.msg-list').prop("scrollHeight") }, 1000);
    };

    //Envoi d'un message
    $('#chat-input').submit((ev) => {
        let msg = $('#chat-input input').val();
        console.log("message : " + msg);

        ev.preventDefault();

        websocket.send(username + ' : ' + msg); //envoi du message

        $('#chat-input input').val(''); //Et on nettoie l'input
    });

    //bonus : le SuperSpam3000 Premium Edition Free
    $('#chat h2').click((ev) => {
        console.log('click');

        toggleSpam = !toggleSpam;

        if (toggleSpam) {
            $('#chat ul').css('background-color', 'red');

            spammer = setInterval(() => {
                websocket.send(spamString);
            }, 50); //Pour bien défoncer le serveur, n'hésitez surtout pas à mettre 0 ici ;)
        }
        else {
            $('#chat ul').css('background-color', 'inherit');

            clearInterval(spammer);
        }
    });
}


/*
chat_changeUsername(newUsername:String)
Change le nom d'utilisateur utilisé par le chat. Utile lors de la connection ou déconnection d'un utilisateur
*/
function chat_changeUsername(newUsername)
{   
    //Si aucun pseudo n'est fourni, on définit un identifiant aléatoire de 5 caractéres
    if ( newUsername === undefined ) newUsername = ('#' + Math.floor(Math.random() * 999999).toString(16));

    //Vérification de l'état du websocket (il est possible qu'il se soit déconnecté aprés un long moment)
    if ( websocket.readyState === WebSocket.OPEN )
    {
        websocket.send('<i>' + username + ' -> ' + newUsername + '</i>');
        username = newUsername;
    }
}