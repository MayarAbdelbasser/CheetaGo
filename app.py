from flask import Flask, render_template, url_for
from auth.routes import auth_bp
from shipment.shipment import shipment_bp, load_shipments

# to generate secret keys
import secrets

# to try the api in external source
from flask_cors import CORS

app = Flask(__name__)
# generate secret key with secrets module
app.secret_key = secrets.token_urlsafe(32)

app.register_blueprint(auth_bp)
app.register_blueprint(shipment_bp)
CORS(app)


@app.route("/")
@app.route("/home")
def homePage():
    return render_template("homePage/index.html")


@app.route("/signin")
def signinPage():
    return render_template("auth/signin.html", title="Signin")


@app.route("/signup")
def signupPage():
    return render_template("auth/signup.html", title="Signup")


@app.route("/shipping")
def shippingPage():
    return render_template("shipping/shippingPage.html", title="Shipping")


@app.route("/dashboard")
def dashboardPage():
    shipments = load_shipments()
    return render_template(
        "dashboard/dashboard.html", title="Dashboard", shipments=shipments
    )


@app.route("/tracking")
def trackingPage():
    return render_template("tracking/trackingPage.html", title="Tracking")
