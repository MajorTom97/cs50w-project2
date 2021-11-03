alert ('Connected');
document.addEventListener('DOMContentLoaded', () => {

    var onstorage = window.localStorage;

    var nickname = localStorage.getItem('nickname');
    //var currentChannel = localStorage.getItem('currentChannel')
    
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

    socket.on('join', data => {
        const li = document.createElement("li");
        li.className = "list"
        li.innerHTML = <b>${data.messages}</b>;
        $("#list").append(li);
        //document.querySelector("#join").append(li);
        //console.log("Send")
    })

    // Send Message
    document.querySelector("#messages").onclick = () => {
        console.log(document.querySelector("user_message").value);
        var message = document.querySelector("#send").value;
        var nickname = localStorage.getItem("name");
        var time = new Date;
        socket.emit("message", {"name": nickname, "message": message, "time": time})
    
        // Clear the box chat
        document.querySelector("user_message").value = "";
    }
    
    socket.on("newMessage", data => {
        var message = document.querySelector("#newMessages");
        //var message_received = 
    })


});