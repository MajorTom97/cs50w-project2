document.addEventListener('DOMContentLoaded', () => {

    var onstorage = window.localStorage;
    var debugChannel = function() {
        console.log = ("var nickname" + nickname);
        console.log = ("var channel" + channel);
        console.log = ("onstorage.currentChannel" + onstorage.currentChanel);
        console.log = ("onstorage.privateRoom" + onstorage.privateRoom);
    };

    // Websocket
    // Server-User connection
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    socket.on('connect', function () {
        const nickname = localStorage.getItem('nickname')
        console.log("Connected")

        socket.emit('online', {
            'user': nickname
        });

        //Local Storage on current channel
        if (storage.currentChannel){
            if (onstorage.privateRoom === "false"){
                joinChannel(onstorage.currentChannel);
                channel = onstorage.currentChannel;
            } else if (onstorage.privateRoom === "true"){
                joinPrivateRoom(onstorage.currentChannel);
                channel = onstorage.currentChannel;
            } else {
                // Default channel #general
                joinChannel(channel);
            }
        } 
        socket.on('message', function(msg) {
            // Insert Content 
            $('#texto-msj').append('<li>' + msg + '</li>')
          })
            //Send message
          document.querySelector('#send-msg').onclick = () => {
            console.log(document.querySelector("#user-msg").value);
            socket.send(('#mi-msj').val());
            $('#mi-msj').val('');
          }
    });

});