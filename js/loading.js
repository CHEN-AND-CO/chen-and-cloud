'use strict';


/*
loadPhotos(ajaxResponse:String)
Charge la liste des miniatures des photos, et ajoute les binds appropriés sur les miniatures
*/
function loadPhotos(ajaxResponse) {
    var photos = JSON.parse(ajaxResponse);
    //Ajout des miniatures à la page
    for (const i in photos) {
        var balise = document.createElement('div');
        balise.innerHTML = '<a href="#"><img class="thumbnail" src="' + photos[i].src + '" id="photo-' + photos[i].id + '"></a>';
        $('#thumbnails').append(balise);

        $('#photo-' + photos[i].id).unbind('click') //Retire les binds précédents
            .click( //Bind de l'event clic
                function (event) {
                    var id = event.target.id.substr(6);
                    event.preventDefault();
                    //récupére la photo en grand et ses commentaires
                    ajaxRequest('GET', 'php/request.php/photos/', loadPhoto, 'id=' + id);
                    ajaxRequest('GET', 'php/request.php/comments/', loadComments, 'id=' + id);
                })
            .on('load', (event) => {
                showPhotosAnim(photos.length);  //Affiche les photos une fois chargées
            })
            .css('opacity', '0');
    }
}

/*
loadPhoto(ajaxResponse:String)
Charge une grande photo et l'insére dans la page
*/
function loadPhoto(ajaxResponse) {
    var photo = JSON.parse(ajaxResponse);
    var balise = '<h2>' + photo[0].title + '</h2>';
    balise += '<a href="#" class="thumbnail"><img src="' + photo[0].src + '"></a>';

    //Ajout de la photo
    $('#photo').html(balise);
    $('#photo').attr('photoid', photo[0].id);
}

/*
loadComments(ajaxResponse:String)
Affiche les commentaires associés à la photo sélectionnée sur la page
*/
function loadComments(ajaxResponse) {
    var comments = JSON.parse(ajaxResponse);
    console.log(comments);

    $('#comments .msg-list').html("");  //Suppression des commentaires précédents s'il y en a

    //Ajout de chaque commentaire
    for (const i in comments) {
        var balise = document.createElement('div');
        console.log(comments[i].userLogin);

        //Création de la structure du commentaire
        var comment = '<li class="message"><div class="comment-header"><span class="author">';
        comment += comments[i].userLogin;
        comment += '</span>';
        //Si l'utilisateur connecté est propriétaire du commentaire, y ajouter un bouton de suppression dudit commentaire
        if (comments[i].userLogin === Cookies.get('login')) comment += '<button class="comment-delete" id="delete-' + comments[i].id + '">×</button>';
        comment += '</div>' + comments[i].comment + '</li>';

        balise.innerHTML = comment;
        $('#comments .msg-list').append(balise);

        //Gestion du clic sur le bouton de suppression
        $('#delete-' + comments[i].id).unbind('click').click(
            function (event) {
                var id = event.target.id.substr(7);
                var photoId = $('#photo').attr('photoid');
                event.preventDefault();

                //Suppression du commentaire, et actualisation de la liste des commentaires
                if (id != undefined && photoId != undefined) {
                    ajaxRequest('DELETE', 'php/request.php/comments/', function () {
                        ajaxRequest('GET', 'php/request.php/comments/', loadComments, 'id=' + photoId);
                        new NotifyNotification('Vous avez supprimé un commentaire', "C'est triste pour lui. RIP in pepperoni", 'info');

                    }, 'id=' + id);
                }
            }
        );
    }

    $("#comment-input").show(); //Affichage du formulaire d'envoi de commentzire

    //Gestion de l'envoi d'un nouveau commentaire
    $('#comment-input').off('submit').submit((event) => {
        var comment = $('#comment-msg').val();
        var photoId = $('#photo').attr('photoid');
        event.preventDefault();

        //Ajout du commentaire à la BDD et actualisation des commentaires
        if (comment != '' && photoId != undefined) {
            ajaxRequest('POST', 'php/request.php/comments/', () => {

                ajaxRequest('GET', 'php/request.php/comments/', loadComments, 'id=' + photoId);
                new NotifyNotification('Votre commentaire a été ajouté', "Merci d'avoir pris le temps de laisser un commentaire <3", 'ok');
            
            }, 'id=' + photoId + '&comment=' + comment);
        }

        $('#comment-msg').val('');
    });
}

var nbItemsLoaded = 0;  //Nombre de photos à charger

/*
showPhotosAnim(nbItems:integer)
Affiche les miniatures avec une animation de fade-in une fois toutes les miniatures chargées
*/
function showPhotosAnim(nbItems) {
    nbItemsLoaded++;    //Une miniature supplémentaire a été chargée*

    console.log(nbItemsLoaded + ' loaded out of ' + nbItems);

    //Si toutes les photos ont été chargées, lancement de l'animation
    if (nbItemsLoaded >= nbItems) {
        $('.thumbnail').each((i) => {
            $('.thumbnail#photo-' + (i + 1)).css('transition-delay', (i / 40) + 's').css('opacity', '1');   //transition-delay est utilisé pour faire apparaitre de maniére progressive les photos
        });
    }
}