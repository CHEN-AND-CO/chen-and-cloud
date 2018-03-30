<<<<<<< HEAD
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
=======
/* Génération d'un utilisateur avec un nom random, collision peu probable */
var username = ('#' + Math.floor(Math.random() * 999999).toString(16));

var websocket;

/* Initialisation du Chat */
function initChat(login) {
    websocket = new WebSocket('ws://' + window.location.hostname + ':12345'); //Init WebSocket
    //var username = '#' + Math.floor(Math.random() * 424242).toString(16);

    if (login != undefined) username = login;//Si on a un login, on le met à la place du nom random
    var spamString = "CHEN & CO"; //Bon en vrai c'est drôle de spammer
    var toggleSpam = false; //Mais il ne faut pas trop exagerer non plus
    var spammer;


    websocket.onopen = () => { //Quand on se connecte
        console.log("Websocket connected.");
        websocket.send(username + " s'est connecté"); //On dit que l'on est là
    };

    websocket.onerror = function (er) { //Quand ça va mal
        console.error("Unable to open websocket connection on " + websocket.url); //On le dit
        $('#chat ul.msg-list').html('<div class="text-alert">Service non disponible</div>'); //Mais bon on l'affiche aussi
    }

    websocket.onmessage = (event) => { //Quand on reçoit des trucs
        $('#chat ul.msg-list').append('<li class="message">' + event.data + '</li>'); //On l'affiche dans le chat

        $("#chat ul.msg-list").finish();
        $("#chat ul.msg-list").animate({ scrollTop: $('#chat ul.msg-list').prop("scrollHeight") }, 1000); //En plus c'est bo
    };


    $('#chat-input').submit((ev) => { //Quand on envoie un message
        let msg = $('#chat-input input').val(); //On récupère le champ de texte
        console.log("message : " + msg); //Ptit affichage dans la console pour debugger
>>>>>>> ed295f65c4b1ebaffdcda44b155672119355e6bb

        ev.preventDefault(); //NE SURTOUT PAS RAFRAICHIR LA PAGE (Appuye sur F5)

<<<<<<< HEAD
        websocket.send(username + ' : ' + msg); //envoi du message

        $('#chat-input input').val(''); //Et on nettoie l'input
    });

    //bonus : le SuperSpam3000 Premium Edition Free
    $('#chat h2').click((ev) => {
=======
        websocket.send(username + ' : ' + msg); //On envoie au serveur

        $('#chat-input input').val(''); //On vide le champ de texte
    });

    $('#chat h2').click((ev) => { //Super fonctionnalité trop cool
>>>>>>> ed295f65c4b1ebaffdcda44b155672119355e6bb
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

<<<<<<< HEAD

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
=======
/* Changement du nom d'utilisateur dans le chat */
function chat_changeUsername(newUsername) {
    /* Quand on n'a plus de nom, on obtient un nom aléatoire */
    if (newUsername === undefined) newUsername = ('#' + Math.floor(Math.random() * 999999).toString(16));

    /* On change le nom */
    if (websocket.readyState === WebSocket.OPEN) {
        websocket.send(username + ' -> ' + newUsername); //On dit aux autres que l'on a changé de nom (on est pas des sauvages)
>>>>>>> ed295f65c4b1ebaffdcda44b155672119355e6bb
        username = newUsername;
    }
}