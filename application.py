import os

from flask import Flask, redirect, render_template, request, session, url_for
from flask_socketio import SocketIO, emit, send, join_room, leave_room
from helpers import login_required
from time import localtime, strftime

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY") or "esta/esmi/secret-key"
socketio = SocketIO(app)


# global variables
nicknames = []
channels = []
channels.append("General")
max_messages = 100

# Messages on the current channel
channelMessage = dict()

@app.route("/")
def index():
    if "name" in session:
        return render_template("chat.html", channels=channels)
    else:
        return render_template("base.html")

@app.route("/chat", methods=["GET", "POST"])
def chat():
    if request.method == "GET":
        if "name" in session:
            return render_template("chat.html")
        else:
            return render_template("base.html")
    else:

       nickname = request.form.get("nickname")
        # Check if the nicknmane is already useb by current user or not
       if nickname in nicknames:
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
    newChannel=request.form.get("newChannel")
    channel = data["channel"]
    # Identified if the new Channel already exitst 
    if channel and channel not in channels:
        channels[channel] = []
        # Emit on the client-side
        print("------------")
        emit('newChannel', channel, broadcast=True)
        print("New Channel {channel} is ready to use!")
    else:
        print(f'{channel}: name channel already taken')


@socketio.on('messages')
def newMessages(data):
    global channels
    # channel = data["channel"]
    channel = session.get("channel")
    message = ["message"]
    time = strftime(localtime())
    channel = session.get("channel")
    channelMessage[channel].append([session.get("nickname"), message, time])
    emit("newMsj", {
        "nickname": session.get("nickname"),
        "message": message,
        "time": time},
        channel=channel)
    # if lenght channels dictionary return the list of channels where message id
    # equal to the lsit of channels and display the new message on the screen
    if len(channels[channel]):
        message["message"] = channels[channel][-1]["message"][+1]
    else:
        message["message"] = 0

    channels[channel] += [message]
    emit(f'New Messages on channel', message, channel)

# Join to a channel
@socketio.on("join")
def join_on():
    nickname = session.get("nickname")
    channel = session.get("channel")
    join_room(channel)
    emit("Joined to {channel}", {
        "message": nickname + "new messages"}, channel=channel)
    print("--------")
    print('{nickname} joined the {channel}')
    print("--------")

if __name__=="__main__":
    socketio.run(app)