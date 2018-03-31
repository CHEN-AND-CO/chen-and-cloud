$(() => {
    var login = Cookies.get('login');   //Récupération du login

    /*var test = new NotifyNotification("Ia'orana !", "Ceci est un test de la notification", 'info', 5000);
    test2 = new NotifyNotification("Ia'orana !", "Ceci est un test de la notification", 'ok' );
    test3 = new NotifyNotification("Ia'orana !", "Ceci est un test de la notification", 'warning' );
    new NotifyNotification("Ia'orana !", "Ceci est un test de la notification", 'error' );*/

    //$('.popup').hide();

    //Vérification de l'authentification
    checkAuth((isAuth) => {
        if (isAuth && login != undefined) { //Si l'utilisateur est connecté
            $('#connect-menu').html(login);
            new NotifyNotification('Connecté !', 'Vous êtes bien connecté, profitez bien !', 'ok');

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

            new NotifyNotification('Connection nécessaire', 'Vous devez vous authentifier pour utiliser certaines fonctionnalités de cette page', 'error');
        }
    });
});