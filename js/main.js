$(() => {
    var login = Cookies.get('login');

    checkAuth( (isAuth) => {
        if ( isAuth )
        {
            $('#connect-menu').html(login);
            initChat(login);
            ajaxRequest('GET', '/php/request.php/photos/', loadPhotos);
        } else {
            initChat();
        }
    });
});