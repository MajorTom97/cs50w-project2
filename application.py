import os

from flask import Flask, redirect, render_template, request, session, url_for
from flask_socketio import SocketIO, emit, send, leave_room, join_room
from helpers import login_required
from time import localtime, strftime

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# global variables
nicknames = dict()
channels = ["general"]

@app.route("/")
def index():
    if "nickname" in session:
        return render_template("chat.html")
    else:
        return render_template("signin.html")

@app.route("/singin", methods=["GET", "POST"])
def singin():
    if request.method == "POST":
       nickname = request.form.get("nickname")
        # Check if the nicknmane is already useb by current user or not
       if nickname in nicknames:
           return redirect("/signin", message="Nickname already taken") 
       # Session updated and add user to logged-in users
       session['nickname'] = nickname
       # Add an nickname with value 
       nicknames[nickname] = None 
       #Initialize the general channel
       session['currentChannel'] = "general"
       
       return redirect("/chat")    
    else: 
        request.method == "GET"
        return render_template("signin.html")

@app.route("/logout")
def logout():
    # Remove the current user from the lists of users
    nicknames.pop(session['nickname'], None)

    session.clear()
    return redirect(url_for("base"))

@app.route("/channels", methods=["GET", "POST"])
def channels():
    if request.method == "POST":
        # newChannel
        newChannel = request.form.get("room-name")

        #update to the current channel
        session['currentChannel'] = newChannel

        # If it is a new channel room
        if newChannel not in channels:
            # Add a new channel text
            channels.append(newChannel)
        return redirect(url_for("chat"))

    elif request.method == "GET":
        return render_template("channels.html")

@app.route("/chat")
@login_required
def chat():
    # Current lists of channels as the current users of the channels
    return render_template("chat.html", channels=channels, nickname=nicknames)