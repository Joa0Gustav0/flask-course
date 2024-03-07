from flask import Flask, render_template, url_for, request;
app = Flask(__name__);

from markupsafe import escape;
from data import MarketItems;


@app.route("/")
def index() :
  return render_template(
    "index.html",
    styles=[url_for("static", filename="comum.css")]
  );

@app.route("/market")
def market() :
  return render_template(
    "market.html", 
    items=MarketItems().getAllItems(),
    styles=[
      url_for("static", filename="comum.css"),
      url_for("static", filename="market.css")
    ],
  );

@app.route(f"/market/product/<int:product_id>")
def productPage(product_id) :
  return render_template(
    "product-page.html", 
    item=MarketItems().getItemByID(product_id),
    styles=[url_for("static", filename="comum.css")]
  );

@app.route("/cookies")
def cookies() :
  return request.cookies;