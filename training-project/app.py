from flask import Flask, render_template
app = Flask(__name__);

@app.route("/")
def index() :
  return render_template("index.html");

@app.route("/market")
def market() :
  return render_template("market.html");