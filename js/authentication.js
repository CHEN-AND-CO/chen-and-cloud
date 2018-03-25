'use strict';

function authentication() {    
    $('#authentication-send').off('click').click(validateLogin);
    $("#authentication").show();
}

function validateLogin(event) {
    var login, password, text, xhr;

    event.preventDefault();
    console.log("auth request");
    

    login = $('#login').val();
    password = $('#password').val();
    $('#errors').html('');

    Cookies.set('login', login);

    xhr = new XMLHttpRequest();
    xhr.open('GET', 'php/request.php/authenticate', true);
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(login + ':' + password));

    xhr.onload = function () {
        switch (xhr.status) {
            case 200:
                Cookies.set('token', xhr.responseText);
                $("#authentication").hide();
                $('#infos').html('Authentification OK');
                $('#connect-menu').html(login);

                $('#authentication-send').off('click');

                $('#connect-menu').off('click').click( (event) => {
                    $('#profile').toggle();
                    $('#profile h2').html(login);  
                    $('#profile #disconnect').off('click').click(disconnect);            
                });
                
                chat_changeUsername(login);
                ajaxRequest('GET', '/php/request.php/photos/', loadPhotos);
                break;
            default:
                httpErrors(xhr.status);
        }
    };

    xhr.send();
}

function checkAuth(callback)
{
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'php/request.php/checkToken', true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + Cookies.get('token'));
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function ()
    {
        console.log(xhr.status);
        
        switch (xhr.status)
        {
            case 200:
                callback(true);
                break;

            default:
                httpErrors(xhr.status);
                callback(false);
        }
    };

    xhr.send();
}

function disconnect()
{
    Cookies.remove('login');
    Cookies.remove('token');

    chat_changeUsername();
    $('#thumbnails').html('');
    $('#image-viewer *').html('');

    $('#connect-menu').off('click').click( (event) => {
        $('#authentication-send').off('click').click(validateLogin);
        $('#authentication').toggle();
    });

    $('#profile').hide();
    $('#connect-menu').html('Connection');
}