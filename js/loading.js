'use strict';

function loadPhotos(ajaxResponse) {
    var photos = JSON.parse(ajaxResponse);

    for (const i in photos) {
        var balise = document.createElement('div');
        balise.innerHTML = '<a href="#"><img class="thumbnail" src="' + photos[i].src + '" id="photo-' + photos[i].id + '"></a>';
        $('#thumbnails').append(balise);

        $('#photo-' + photos[i].id).unbind('click')
            .click(
                function (event) {
                    var id = event.target.id.substr(6);
                    event.preventDefault();
                    ajaxRequest('GET', 'php/request.php/photos/', loadPhoto, 'id=' + id);
                    ajaxRequest('GET', 'php/request.php/comments/', loadComments, 'id=' + id);
                })
            .on('load', (event) => {
                showPhotosAnim(photos.length);
            })
            .css('opacity', '0');
    }

    //$('.thumbnail');
}

function loadPhoto(ajaxResponse) {
    var photo = JSON.parse(ajaxResponse);
    var balise = '<h2>' + photo[0].title + '</h2>';
    balise += '<a href="#" class="thumbnail"><img src="' + photo[0].src + '"></a>';

    $('#photo').html(balise);
    $('#photo').attr('photoid', photo[0].id);
}

function loadComments(ajaxResponse) {
    var comments = JSON.parse(ajaxResponse);
    console.log(comments);

    $('#comments .msg-list').html("");
    for (const i in comments) {
        var balise = document.createElement('div');
        console.log(comments[i].userLogin);

        var comment = '<li class="message"><span class="author">';
        comment += comments[i].userLogin;
        comment += '</span>' + comments[i].comment + '</li>';

        balise.innerHTML = comment;
        $('#comments .msg-list').append(balise);

        $('#delete-' + comments[i].id).unbind('click').click(
            function (event) {
                var id = event.target.id.substr(7);
                var photoId = $('#photo').attr('photoid');
                event.preventDefault();

                if (id != undefined && photoId != undefined) {
                    ajaxRequest('DELETE', 'php/request.php/comments/', function () {
                        ajaxRequest('GET', 'php/request.php/comments/', loadComments, 'id=' + photoId);
                    }, 'id=' + id);
                }
            }
        );
    }

    $("#comment-input").show();
    $('#comment-input').off('submit').submit((event) => {
        var comment = $('#comment-msg').val();
        var photoId = $('#photo').attr('photoid');
        event.preventDefault();

        if (comment != '' && photoId != undefined) {
            ajaxRequest('POST', 'php/request.php/comments/', () => {
                ajaxRequest('GET', 'php/request.php/comments/', loadComments,
                    'id=' + photoId);
            }, 'id=' + photoId + '&comment=' + comment);
        }
    });
}

var nbItemsLoaded = 0;

function showPhotosAnim(nbItems) {
    nbItemsLoaded++;

    console.log(nbItemsLoaded + ' loaded out of ' + nbItems);


    if (nbItemsLoaded >= nbItems) {
        $('.thumbnail').each((i) => {
            $('.thumbnail#photo-' + (i + 1)).css('transition-delay', (i / 40) + 's').css('opacity', '1');
        });
    }
}