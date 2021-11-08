from collections import deque
import os

from flask import Flask, redirect, render_template, request, session, url_for, flash
from flask_socketio import SocketIO, emit, join_room, leave_room
from helpers import login_required
from time import localtime, strftime
from collections import deque

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY") or "esta/esmi/secret-key"
socketio = SocketIO(app, )


# global variables
nicknames = []
channels = []
channels.append("General")
max_messages = 100

# Messages on the current channel
channelMessage = dict()
channelMessage["General"] = []

@app.route("/")
def index():
    global channels
    if "name" in session:
        print(channels)
        return render_template("chat.html", channel_list = channels)
    else:
        return render_template("base.html")

@app.route("/chat", methods=["GET", "POST"])
def chat():
    if request.method == "GET":
        if "name" in session:
            print(channels)
            return render_template("chat.html", channel_list = channels)
        
        else:
            return render_template("base.html")
    else:

       nickname = request.form.get("nickname")
        # Check if the nicknmane is already useb by current user or not
       if nickname in nicknames:
           flash("User already exists")
           return redirect("/chat") 
       # Session updated and add user to logged-in users
       session['name'] = nickname
       # Add the list the names
       nicknames.append(nickname)
       #Initialize the general channel
       session['currentChannel'] = "General"
       print("---------------------")
       print(nickname)
       print(session['name'])
       
       return redirect("/") 

@app.route("/logout")
def logout():
    # Remove the current user from the lists of users
    session.clear()
    return redirect("chat")

#Socketio
@socketio.on('connect')
def channel_list():
    emit('all-channels', channels=[])
    


@socketio.on('newChannel')
def create_channel(data):
    global channels
    # newChannel=request.form.get("newChannel")
    # Dict key
    channel = data["channel"]
    # Identified if the new Channel already exitst 
    if channel and channel not in channels:
        channelMessage[channel] = []
        channels.append(channel)
        # Emit on the client-side
        print("------------")
        print("New Channel {channel} is ready to use!")
        emit('newChannel', {"channel":channel}, broadcast=True)
    else:
        emit("showERROR", {"content":f'{channel}: name channel already taken'})
        print(f'{channel}: name channel already taken')

@socketio.on('load_messages')
def load_messages(data):
    global channels
    channel = data["channel"]
    emit('load_messages', {
        "messages": list(channelMessage[channel])
    })

@socketio.on('message')
def newMessages(data):
    global channels
    channel = data["channel"]
    print(data)
    message = data["message"]
    time = data["time"]
    user_message = {"user": session.get("name"), "content": message, "time": time}
    channelMessage[channel] = deque(maxlen = 100)
    # channelMessage.append(message)
    channelMessage[channel].append(user_message)
    emit("newMessage", user_message, to = channel)
    # if lenght channels dictionary return the list of channels where message id
    # equal to the lsit of channels and display the new message on the screen
    

# Join to a channel
@socketio.on("join")
def join_on(data):
    nickname = session.get("name")
    channel = data["channel"]
    join_room(channel)
    message = f"{nickname} joined to {channel}"
    print("--------")
    print("--------")
    print(f'{nickname} joined to {channel}')
    emit("showLOG", {"message": message}, to = channel)

@socketio.on("leave")
def leave_chat(data):
    nickname = session.get("name")
    channel = data["channel"]
    leave_room(channel)
    message = f"{nickname} leaved {channel}"
    print("--------")
    print("--------")
    print(f'{nickname} leaved {channel}')
    emit("showLOG", {"message": message}, to = channel)
   

if __name__=="__main__":
    socketio.run(app, debug=True)