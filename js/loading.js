'use strict';

function loadPhotos(ajaxResponse) {
    var photos = JSON.parse(ajaxResponse);

    for (const i in photos) {
        var balise = document.createElement('div');
        balise.className = 'col-xs-2 col-md-2';
        balise.innerHTML = '<a href="#" class="thumbnail"><img src="' + photos[i].src + '" id="photo-' + photos[i].id + '"></a>';
        $('#thumbnails').append(balise);

        $('#photo-' + photos[i].id).unbind('click').click(
            function (event) {
                var id = event.target.id.substr(6);
                event.preventDefault();
                ajaxRequest('GET', 'php/request.php/photos/' + id, loadPhoto);
                ajaxRequest('GET', 'php/request.php/comments/', loadComments, 'id=' + id);
            });
    }
}

function loadPhoto(ajaxResponse) {
    var photo = JSON.parse(ajaxResponse);
    var balise = '<div class="panel panel-default"><div class="panel-body">';
    balise += '<h2>' + photo[0].title + '</h2>';
    balise += '<div class="row"><div class="col-xs-12 col-md-12">';
    balise += '<a href="#" class="thumbnail"><img src="' + photo[0].src + '">';
    balise += '</a></div></div></div></div>';
    $('#photo').html(balise);
    $('#photo').attr('photoid', photo[0].id);
}

function loadComments(ajaxResponse) {
    var comments = JSON.parse(ajaxResponse);

    $('#comments').html("");
    for (const i in comments) {
        var balise = document.createElement('div');
        var comment = '<div class="panel panel-default"><div class="panel-body">' +
            comments[i].login + ' : ' + comments[i].comment +
            '<span id=delete-' + comments[i].id +
            ' class="glyphicon ' + 'glyphicon-trash pull-right"></span>' + '</div></div>';
        balise.innerHTML = comment;
        $('#comments').append(balise);

        $('#delete-' + comments[i].id).unbind('click').click(
            function (event) {
                var id = event.target.id.substr(7);
                var photoId = $('#photo').attr('photoid');
                event.preventDefault();

                if (id != undefined && photoId != undefined) {
                    ajaxRequest('DELETE', 'php/request.php/comments/' + id, function () {
                        ajaxRequest('GET', 'php/request.php/comments/', loadComments, 'id=' + photoId);
                    });
                }
            });
    }

    $("#comments-add").show();
    $('#add').unbind('click').click(
        function (event) {
            var comment = $('#comment').val();
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