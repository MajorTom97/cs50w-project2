alert ('Conected');
document.addEventListener('DOMContentLoaded', () => {

    var onstorage = window.localStorage;

    var nickname = localStorage.getItem('nickname');
    var currentChannel = localStorage.getItem('currentChannel')
    
    var debugChannel = function() {
        console.log = ("var nickname" + nickname);
        console.log = ("var channel" + channel);
        console.log = ("onstorage.currentChannel" + onstorage.currentChanel);
    };

    debugChannel();


    // Websocket
    // Server-User connection
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    socket.on('connect', function () {
        
        const nickname = localStorage.getItem('nickname')
        console.log("Connected")

        socket.emit('online', {
            'user': nickname
        });
    });


    // Send Message
    document.querySelector("#message").onclick = () =>{
        console.log(document.querySelector("user_message").value);

        // Display messages to general channel
        let data = {'message': document.querySelector("user_message").value, 'username':nickname, 'timestamp':formatTimestamp()};
        formatMessage(data);
    }
    
    // Clear the box chat
    document.querySelector("user_message").value = "";

});