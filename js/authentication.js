'use strict';

/* Gestion du panel d'authentification */
function authentication() {
    $('#authentication-send').off('click').click(validateLogin);
    $('#create-account').off('click').click(createLogin);

    $("#authentication").show(); //On affiche le panel
}

/* Validation du login */
function validateLogin(event) {
    var login, password, text, xhr;

    event.preventDefault(); //Empeche la page de se recharger
    console.log("auth request");


    login = $('#login').val();
    password = $('#password').val();
    $('#errors').html(''); //Vide le conteneur d'erreurs

    Cookies.set('login', login); //Enregistre le login dans un cookie

    xhr = new XMLHttpRequest(); //Init 
    xhr.open('GET', 'php/request.php/authenticate', true); //Demande d'authentification
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(login + ':' + password)); //On met les infos dans le header

    xhr.onload = function () {
        switch (xhr.status) {
            case 200: case 201:
                Cookies.set('token', xhr.responseText); //On enregistre le token dans un cookie
                $("#authentication").hide(); //On cache le panel
                //$('#infos').html('Authentification OK'); //TODO : notification en popup
                $('#connect-menu').html(login); //Affichage du nom de l'utilisateur

                $('#authentication-send').off('click');

                /* Menu de déconnexion */
                $('#connect-menu').off('click').click((event) => {
                    $('#profile').toggle(100);
                    $('#profile h2').html(login);
                    $('#profile #disconnect').off('click').click(disconnect);
                });

                chat_changeUsername(login); //Change le nom de l'utilisateur pour le chat
                ajaxRequest('GET', 'php/request.php/photos/', loadPhotos); //Demande des photos
                break;
            default:
                httpErrors(xhr.status); //Erreurs
        }
    };

    xhr.send(); //A la poste
}

function checkAuth(callback) { //Vérification de l'auth
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'php/request.php/checkToken', true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + Cookies.get('token')); //On prend le cookie enregistré
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        console.log(xhr.status);

        switch (xhr.status) {
            case 200: case 201: //Remarque on n'est pas censé recevoir un HTTP/1.X 201
                callback(true);
                break;

            default:
                httpErrors(xhr.status);
                callback(false);
        }
    };

    xhr.send();//On envoie la requete
}

/* Deconnexion */
function disconnect() {
    Cookies.remove('login');//on supprime le cookie login
    Cookies.remove('token');//on supprime le cookie token

    chat_changeUsername();//On supprime le nom d'utilisateur dans le chat
    $('#thumbnails').html('');//On enlève les photos
    $('#image-viewer #photo').html('');//On enlève la photo vue en grand
    $('#image-viewer #comments ul.msg-list').html(''); // On enlève les comms

    $('#connect-menu').off('click').click((event) => { //On remet le panel d'authentification d'origine
        $('#authentication-send').off('click').click(validateLogin);
        $('#authentication').toggle(100);
    });

    $('#profile').hide();
    $('#connect-menu').html('Connexion');
}


/* Création d'un utilisateur */
function createLogin(event) {
    var login, password, text, xhr;

    event.preventDefault();
    console.log("auth request");

    login = $('#login').val();
    password = $('#password').val();
    $('#errors').html('');

    Cookies.set('login', login);

    console.log('Attempted to create user ' + login + ':' + password);

    xhr = new XMLHttpRequest();
    xhr.open('POST', 'php/request.php/register', true);
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(login + ':' + password));

    xhr.onload = function () {
        switch (xhr.status) {
            case 200:
            case 201: //Si la requète réussie, on est connecté
                Cookies.set('token', xhr.responseText);
                $("#authentication").hide();
                //$('#infos').html('Authentification OK'); //TODO : notification en popup
                $('#connect-menu').html(login);

                //$('#create-account').off('click');

                $('#connect-menu').off('click').click((event) => {
                    $('#profile').toggle(100);
                    $('#profile h2').html(login);
                    $('#profile #disconnect').off('click').click(disconnect);
                });

                chat_changeUsername(login);
                ajaxRequest('GET', 'php/request.php/photos/', loadPhotos); //On récupère les photos
                break;
            default:
                httpErrors(xhr.status);
        }
    };

    xhr.send();
}