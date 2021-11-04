var socket = io();
// Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    alert('Connected');
    socket.on('connect', function () {
        
        const nickname = localStorage.getItem('nickname')
        console.log("Connected")

        socket.emit('online', {
            'user': nickname
        });
    });
    

    socket.on("channels", data => {
        document.querySelector("#newChannel").innerHTML = data.newChannel;
    });
    

    socket.on("load_channels", data =>  {
        document.querySelector('#channel_list').innerHTML = data.channel_lis;
    });

    let addChannel = () =>{
        let
    }
    socket.on('join', data => {
        const li = document.createElement("li");
    
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


