from flask import Flask, render_template, url_for
app = Flask(__name__);

from data import Crud;


@app.route("/")
def index() :
  return render_template("index.html");

@app.route("/market")
def market() :
  return render_template(
    "market.html", 
    items=Crud().executeCrudAction("read", "SELECT * FROM marketitems;"),
    styles=[url_for("market")]
  );