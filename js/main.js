$(() => {
    var login = Cookies.get('login');   //Récupération du login

    //$('.popup').hide();

    //Vérification de l'authentification
    checkAuth((isAuth) => {
        if (isAuth && login != undefined) { //Si l'utilisateur est connecté
            $('#connect-menu').html(login);

            //Initialisation du chat et des photos
            initChat(login);
            ajaxRequest('GET', 'php/request.php/photos/', loadPhotos);
            //Affectation des écouteurs d'événements
            $('#connect-menu').off('click').click((event) => {
                $('#profile').toggle(100);
                $('#profile h2').html(login);
                $('#profile #disconnect').click(disconnect);
            });
        } else {
            initChat(); //Init. chat sans login, un identifiant aléatoire sera affecté

            $('#connect-menu').off('click').click((event) => {
                console.log($('#create-account'));
                
                $('#authentication-send').off('click').click(validateLogin);
                $('#create-account').off('click').click(createLogin);
                $('#authentication').toggle(100);
            });
        }
    });
});