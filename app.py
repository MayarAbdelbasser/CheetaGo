from flask import Flask, render_template, url_for
from auth.routes import auth_bp

# to generate secret keys
import secrets

# to try the api in external source
from flask_cors import CORS

app = Flask(__name__)
# generate secret key with secrets module
app.secret_key = secrets.token_urlsafe(32)

app.register_blueprint(auth_bp)

CORS(app)


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
