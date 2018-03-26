$(() => {
    var login = Cookies.get('login');

    //$('.popup').hide();

    checkAuth((isAuth) => {
        if (isAuth && login != undefined) {
            $('#connect-menu').html(login);
            initChat(login);
            ajaxRequest('GET', 'php/request.php/photos/', loadPhotos);

            $('#connect-menu').off('click').click((event) => {
                $('#profile').toggle();
                $('#profile h2').html(login);
                $('#profile #disconnect').click(disconnect);
            });
        } else {
            initChat();

            $('#connect-menu').off('click').click((event) => {
                $('#authentication-send').off('click').click(validateLogin);
                $('#authentication').toggle();
            });
        }
    });
});