from flask import Flask, render_template, url_for

app = Flask(__name__)


@app.route("/")
@app.route("/home")
def homePage():
    return render_template("index.html")


@app.route("/signin")
def signinPage():
    return render_template("signin.html", title="Signin")


@app.route("/signup")
def signupPage():
    return render_template("signup.html", title="Signup")


@app.route("/forgotPassword")
def forgotPasswordPage():
    return render_template("forgotPassword.html", title="Forgot password")
