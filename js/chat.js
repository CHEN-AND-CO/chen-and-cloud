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
    var toggleSpam = toggleChat = false;
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

        if ( event.data.indexOf('@'+username) > 0 ) new NotifyNotification("Quelqu'un vous a mentionné", "Un utilisateur a mentionné votre pseudo dans le chat", 'info', 5000);

        $("#chat ul.msg-list").finish();    //Termine de précédentes animations (pour éviter des glitches)
        $("#chat ul.msg-list").animate({ scrollTop: $('#chat ul.msg-list').prop("scrollHeight") }, 1000);
    };

    //Envoi d'un message
    $('#chat-input').submit((ev) => {
        let msg = $('#chat-input input').val();
        console.log("message : " + msg);

        ev.preventDefault(); //NE SURTOUT PAS RAFRAICHIR LA PAGE (Appuye sur F5)

        websocket.send(username + ' : ' + msg); //envoi du message

        $('#chat-input input').val(''); //Et on nettoie l'input
    });

    /* Vérification de la taille de l'écran avec media queries, pour 
    déterminer s'il est judicieux d'adapter l'affichage à un téléphone par exemple*/
    if (window.matchMedia("handheld, screen and (max-width: 800px), (aspect-ratio: 9/16)").matches)
    {
        //Adaptation à un écran de faible largeur (le chat slide sur le coté droit)
        $('#chat h2').off('click').click((ev) => {

            toggleChat = !toggleChat;

            if ( toggleChat )
            {
                //Afficher le chat
                $('#chat h2').css('transform', 'translateX(0%)');
                $('#chat').css('transform', 'translateX(0%)');
            }
            else
            {
                //Masquer le chat (on laisse dépasser le titre pour pouvoir le cliquer)
                $('#chat h2').css('transform', 'translateX(-50%)');
                $('#chat').css('transform', 'translateX(100%)');
            }
        });
    }
    else
    {
        //bonus : le SuperSpam3000 Premium Edition Free
        $('#chat h2').click((ev) => {
            console.log('click');

            toggleSpam = !toggleSpam; //Magie magie

            if (toggleSpam) {
                $('#chat ul').css('background-color', 'red'); //Le rouge c'est bien

                spammer = setInterval(() => { //Oui
                    websocket.send(spamString);
                }, 50); //Pour bien défoncer le serveur, n'hésitez surtout pas à mettre 0 ici ;)
            }
            else { //Non
                $('#chat ul').css('background-color', 'inherit');

                clearInterval(spammer);
            }
        });
    }
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