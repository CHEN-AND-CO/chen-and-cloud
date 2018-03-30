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

        ev.preventDefault(); //NE SURTOUT PAS RAFRAICHIR LA PAGE (Appuye sur F5)

        websocket.send(username + ' : ' + msg); //On envoie au serveur

        $('#chat-input input').val(''); //On vide le champ de texte
    });

    $('#chat h2').click((ev) => { //Super fonctionnalité trop cool
        console.log('click');

        toggleSpam = !toggleSpam; //Magie magie

        if (toggleSpam) {
            $('#chat ul').css('background-color', 'red'); //Le rouge c'est bien

            spammer = setInterval(() => { //Oui
                websocket.send(spamString);
            }, 50);
        }
        else { //Non
            $('#chat ul').css('background-color', 'inherit');

            clearInterval(spammer);
        }
    });
}

/* Changement du nom d'utilisateur dans le chat */
function chat_changeUsername(newUsername) {
    /* Quand on n'a plus de nom, on obtient un nom aléatoire */
    if (newUsername === undefined) newUsername = ('#' + Math.floor(Math.random() * 999999).toString(16));

    /* On change le nom */
    if (websocket.readyState === WebSocket.OPEN) {
        websocket.send(username + ' -> ' + newUsername); //On dit aux autres que l'on a changé de nom (on est pas des sauvages)
        username = newUsername;
    }
}