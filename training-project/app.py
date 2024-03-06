from flask import Flask, render_template, url_for, request
app = Flask(__name__);

from data import Crud;


@app.route("/", methods=["GET", "POST"])
def index() :
  test_request = request.form["username"] if request.method == "POST" else "Ploft!";

  return render_template("index.html", test=test_request);

@app.route("/market")
def market() :
  return render_template(
    "market.html", 
    items=Crud().executeCrudAction("read", "SELECT * FROM marketitems;"),
    styles=[url_for("static", filename="market.css")],
  );