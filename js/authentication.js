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
                
                alert('Authentification OK');
                break;
            default:
                httpErrors(xhr.status);
        }
    };

    xhr.send();
}

$('#connect-menu').click( (event) => {
    $('#authentication-send').off('click').click(validateLogin);
    $('#authentication').toggle();
});

ajaxRequest('GET', 'php/request.php/photos/', () => { });