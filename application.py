import os

from flask import Flask, redirect, render_template, request, session, url_for
from flask_socketio import SocketIO, emit, send, leave_room, join_room
from helpers import login_required
from time import localtime, strftime

app = Flask(__name__)
app.config["SECRET_KEY"] = "esta/esmi/secret-key"
socketio = SocketIO(app)


# global variables
nicknames = []
channels = ["general"]

@app.route("/")
def index():
    if "nombre" in session:
        return render_template("chat.html")
    else:
        return render_template("signin.html")

@app.route("/chat", methods=["GET", "POST"])
def chat():
    if request.method == "GET":
        if "nombre" in session:
            return render_template("chat.html")
        else:
            return render_template("signin.html")
    else:

       nickname = request.form.get("nickname")
        # Check if the nicknmane is already useb by current user or not
       if nickname in nicknames:
           return redirect("/chat", message="Nickname already taken") 
       # Session updated and add user to logged-in users
       session['nombre'] = nickname
       # Add the list the names
       nicknames.append(nickname)
       #Initialize the general channel
       session['currentChannel'] = "general"
       print("---------------------")
       print(nickname)
       print(session['nombre'])
       
       return redirect("/") 

@app.route("/logout")
def logout():
    # Remove the current user from the lists of users
    session.clear()
    return redirect("chat")
