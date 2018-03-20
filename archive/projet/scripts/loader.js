
function loadPhotos(rep)
{
    console.log(rep);  
    
    let photos = JSON.parse(rep);

    for (const i in photos)
    {
        $('#main-gallery').append('<img class="thumbnail" id="'+photos[i].id+'" src="'+photos[i].src+'">');
    }
}

$(function () {
    console.log("Hello");
    
    ajaxRequest('GET', 'php/request.php/photos/', loadPhotos);
})