from flask import Flask, render_template, url_for, abort, request, make_response;
app = Flask(__name__);

from markupsafe import escape;
from data import MarketItems, listStylesURL; 

@app.route("/")
def index() :

  return render_template(
    "index.html"
  );

@app.route("/market")
def market() :
  return render_template(
    "market.html", 
    items=MarketItems().getAllItems(),
    styles=listStylesURL("market.css"),
  );

@app.route(f"/market/product/<int:product_id>")
def productPage(product_id) :
  target_item = MarketItems().getItemByID(product_id);

  if target_item == None :
    abort(404);

  return render_template(
    "product-page.html", 
    item=target_item,
    product_image=url_for("static", filename="alt-product-image.png"),
    styles=listStylesURL("product-page.css")
  );

@app.errorhandler(404)
def notFoundPage(error) :
  return render_template(
    "not-found.html",
    styles=listStylesURL("not-found.css"),
    main_image=url_for("static", filename="not-found-image.gif")
  ), 404;