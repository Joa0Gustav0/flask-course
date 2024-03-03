from flask import Flask, render_template

#Datas
from data import market_items

app = Flask(__name__);

@app.route("/")
def index() :
  return render_template("index.html");

@app.route("/market")
def market() :
  return render_template("market.html", market_items=market_items);

