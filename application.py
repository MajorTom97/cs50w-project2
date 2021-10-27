import os

from flask import Flask, redirect, render_template, request, session, url_for
from flask_socketio import SocketIO, emit, send
from helpers import login_required
from time import localtime, strftime

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY") or "esta/esmi/secret-key"
socketio = SocketIO(app)


# global variables
nicknames = []
channels = ["general"]

@app.route("/")
def index():
    if "name" in session:
        return render_template("chat.html", channels=channels)
    else:
        return render_template("signin.html")

@app.route("/chat", methods=["GET", "POST"])
def chat():
    if request.method == "GET":
        if "name" in session:
            return render_template("chat.html")
        else:
            return render_template("signin.html")
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
       session['currentChannel'] = "general"
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
    channel = data[""]
    # Identified if the new Channel already exitst 
    if channel and "" not in channels:
        channels[channel] = []
        # Emit on the client-side
        emit('newChannel', channel, broadcast=True)
    else:
        print(f'{channel}: name channel already taken')


@socketio.on('messages')
def newMessages(data):
    global channels
    channel = data["channel"]
    message = {
        "author": data["nickname"],
        "message": data["message"],
        "timestamp": strftime('%H', localtime())
    }

    if __name__=="__main__":
        socketio.run(app)