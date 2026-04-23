from flask import Flask, render_template, url_for

app = Flask(__name__)


@app.route("/")
@app.route("/home")
def homePage():
    return render_template("index.html")


@app.route("/signin")
def signin():
    return render_template("signin.html", title="Signin")
