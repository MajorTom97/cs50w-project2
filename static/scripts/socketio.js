var socket = io();

if (localStorage.getItem("last_channel") == null){
    localStorage.setItem("last_channel", "General");
} 
// Connect to websocket
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

socket.on('connect', function () {

    const nickname = localStorage.getItem('nickname')
    console.log("Connected")
    socket.emit('join', {"channel": localStorage.getItem("last_channel")})

    socket.emit('online', {
        'user': nickname
    });
});


socket.on("channels", data => {
    document.querySelector("#newChannel").innerHTML = data.newChannel;
});


// socket.on("load_channels", data => {
//     document.querySelector('#channel_list').innerHTML = data.channel_lis;
// });

// Channels
let newChannel = () => {
    var channelName = document.querySelector("#newChannel").value;
    socket.emit("newChannel", {"channel":channelName});
    document.querySelector("#newChannel").value = "";
}

socket.on("newChannel", data => {
    let element = `<div class="list-group py-1">
                    <span onclick = "channelSelection('${data.channel}')" class="list-group-item">${data.channel}</span>
                    </div>`;
    document.querySelector("#container-channels").innerHTML += element;

})

function channelSelection (channel) {
    socket.emit('leave', {"channel": localStorage.getItem("last_channel")});
    localStorage.setItem("last_channel", channel);
    document.title="Flack: Chat Room " + channel;
    socket.emit('join', {"channel": localStorage.getItem("last_channel")});
    socket.emit("load_messages", {"channel":channel});
    
}

socket.on("load_messages", data => {
    var container = document.querySelector("#id_messages");
    container.innerHTML = "";
    data.messages.forEach(element => {
    let ele = `<div class="chat-bubble chat-bubble--left">${element.user} : ${element.content}<br>${element.time}</br></div>`;
    container.innerHTML += ele; 
    });
    
})



// socket.on('join', data => {
//     const li = document.createElement("li");

//     li.innerHTML = `<b>${data.messages}</b>`;
//     $("#list").append(li);
//     //document.querySelector("#join").append(li);
//     //console.log("Send")
// })

// Send Message
document.querySelector("#button-addon2").onclick = () => {
    console.log(document.querySelector("#user_message").value);
    var message = document.querySelector("#user_message").value;
    var nickname = localStorage.getItem("name");
    var time = new Date();
    socket.emit("message", { "name": nickname, "message": message, "time": time, "channel":localStorage.getItem("last_channel")})

    // Clear the box chat
    document.querySelector("#user_message").value = "";
    console.log("send message")
}

socket.on("newMessage", data => {
    var container = document.querySelector("#id_messages");
    let element = `<div class="chat-bubble chat-bubble--left">${data.user} : ${data.content}<br>${data.time}</br> </div>`;
    element.className == "not-me"  
    container.innerHTML += element;
    console.log("received message")
})

socket.on("showERROR", data => {
    alert(data.content);
})

socket.on("showLOG", data => {
    var container = document.querySelector("#id_messages");
    let element = `<div class="chat_log alert alert-dark" role="alert">${data.message}</div>`;
    container.innerHTML += element;
})

// Themes
const setTheme = theme => document.documentElement.className = theme;

// tinymce.init({
//     selector: "#addon-wrapping",
//     plugins: "emoticons autoresize",
//     toolbar: "emoticons",
//     toolbar_location: "bottom",
//     menubar: false,
//     statusbar: false
//   })