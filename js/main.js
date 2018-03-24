$(() => {
    var login = Cookies.get('login');

    checkAuth( (isAuth) => {
        if ( isAuth )
        {
            $('#connect-menu').html(login);
            initChat(login);
        } else {
            initChat();
        }
    });
});