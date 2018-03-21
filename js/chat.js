const websocket = new WebSocket('ws://' + window.location.hostname + ':12345');
const login = "STALINE";

const spamString = "CHEN & CO";
var toggleSpam;
var spammer;

websocket.onopen = () => {
    console.log("Websocket connected.");
    websocket.send(login + " s'est connecté");
};

websocket.onerror = function (er) {
    console.error("Unable to open websocket connection on " + websocket.url);
}

websocket.onmessage = (event) => {
    $('#chat ul.msg-list').append('<li class="message">' + event.data + '</li>');

    $("#chat ul.msg-list").finish();
    $("#chat ul.msg-list").animate({ scrollTop: $('#chat ul.msg-list').prop("scrollHeight") }, 1000);
};



$(() => {

    $('#chat-input').submit((ev) => {
        let msg = $('#chat-input input').val();
        console.log("message : " + msg);

        ev.preventDefault();

        websocket.send(login + ' : ' + msg);

        $('#chat-input input').val('');
    });

    $('#chat h2').click((ev) => {
        console.log('click');

        toggleSpam = !toggleSpam;

        if (toggleSpam) {
            $('#chat ul').css('background-color', 'red');

            spammer = setInterval(() => {
                websocket.send(spamString);
            }, 50);
        }
        else {
            $('#chat ul').css('background-color', 'inherit');

            clearInterval(spammer);
        }
    });

});