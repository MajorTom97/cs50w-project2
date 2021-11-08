var socket = io();

// alert('socket.js');

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
    // alert('hola')
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
        let element1 = `<div class="chat-bubble chat-bubble--left"><span>${element.user} <span class="float-right">${element.time}:${element.minutes}</span></span><div class="border-top" style="width: 100%"></div>${element.content}</div>`;
        let element2 = `<div class="chat-bubble chat-bubble--right bg-success"><span>${element.user} <span class="float-right">${element.time}:${element.minutes}</span></span><div class="border-top" style="width: 100%"></div>${element.content}</div>`;
        let element3 = `<div class="chat-bubble chat-bubble--left"><span>${element.user} <span class="float-right">${element.time}:${element.minutes}</span></span><div class="border-top" style="width: 100%"></div><img class="img-fluid" src="${element.content}" alt=""></div>`;
        let element4 = `<div class="chat-bubble chat-bubble--right bg-success"><span>${element.user} <span class="float-right">${element.time}:${element.minutes}</span></span><div class="border-top" style="width: 100%"></div><img class="img-fluid" src="${element.content}" alt=""></div>`;

        container.innerHTML += element1;

        // alert(data.user);

        if (element.user == localStorage.getItem("nickname")) {
            if (element.val === "si") {
                container.innerHTML += element3;
            }
            else {
                container.innerHTML += element1;
            }
        }
        else {
            if (element.val === "si") {
                container.innerHTML += element4;
            }
            else {
                container.innerHTML += element2;
            }
        }
    });
});



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

    if (message.endsWith('.png')) {
        socket.emit("message", { "val": "si", "name": nickname, "message": message, "time": time.getHours(), "minutes": time.getMinutes(), "channel":localStorage.getItem("last_channel")})

    }
    else {
        socket.emit("message", { "val": "no",  "name": nickname, "message": message, "time": time.getHours(), "minutes": time.getMinutes(), "channel":localStorage.getItem("last_channel")})
    }



    // Clear the box chat
    document.querySelector("#user_message").value = "";
    console.log("send message")
}

socket.on("newMessage", data => {
    var container = document.querySelector("#id_messages");
    let element1 = `<div class="chat-bubble chat-bubble--left"><span>${data.user} <span class="float-right">${data.time}:${data.minutes}</span></span><div class="border-top" style="width: 100%"></div>${data.content}</div>`;
    let element2 = `<div class="chat-bubble chat-bubble--right bg-success"><span>${data.user} <span class="float-right">${data.time}:${data.minutes}</span></span><div class="border-top" style="width: 100%"></div>${data.content}</div>`;
    let element3 = `<div class="chat-bubble chat-bubble--left"><span>${data.user} <span class="float-right">${data.time}:${data.minutes}</span></span><div class="border-top" style="width: 100%"></div><img class="img-fluid" src="${data.content}" alt=""></div>`;
    let element4 = `<div class="chat-bubble chat-bubble--right bg-success"><span>${data.user} <span class="float-right">${data.time}:${data.minutes}</span></span><div class="border-top" style="width: 100%"></div><img class="img-fluid" src="${data.content}" alt=""></div>`;
    element1.className == "not-me"

    // alert(data.user);

    if (data.user == localStorage.getItem("nickname")) {
        if (data.val === "si") {
            container.innerHTML += element3;
        }
        else {
            container.innerHTML += element1;
        }
    }
    else {
        if (data.val === "si") {
            container.innerHTML += element4;
        }
        else {
            container.innerHTML += element2;
        }
    }
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

// // Themes
// const setTheme = theme => document.documentElement.className = theme;

// // tinymce.init({
// //     selector: "#addon-wrapping",
// //     plugins: "emoticons autoresize",
// //     toolbar: "emoticons",
// //     toolbar_location: "bottom",
// //     menubar: false,
// //     statusbar: false
// //   })