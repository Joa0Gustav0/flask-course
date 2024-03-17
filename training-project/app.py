from flask import Flask, render_template, url_for, abort, redirect, request, session, make_response, send_file;
app = Flask(__name__);

from markupsafe import escape;
from data import MarketItems, Users, listFilesURL; 
import os;

@app.route("/")
def index() :
  return render_template(
    "index.html",
    styles=listFilesURL('index.css'),
    scripts=listFilesURL("index.js")
  );

@app.route("/market")
def market() :
  last_viewed_item_ID = request.cookies.get("UnIm@RkEt_last_viewed_item");

  if last_viewed_item_ID != None :
    items_inspired_on_last_view = MarketItems().getItemsByCategory(
      last_viewed_item_ID,
      MarketItems().getItemByID(last_viewed_item_ID)[4]
    )
  else :
    items_inspired_on_last_view = None


  return render_template(
    "market.html", 
    items=MarketItems().getAllItems(),
    items_inspired_on_last_view=items_inspired_on_last_view,
    styles=listFilesURL("market.css"),
  );

@app.route("/login", methods=["GET", "POST"])
@app.route("/register", methods=["GET", "POST"])
def login() :
  if "login" in request.path :
    focus_action = "on-login-view";
  else :
    focus_action = "on-register-view";

  return render_template(
    "login-register.html",
    container_focus=focus_action,
    users_in_database=Users.getUsers(),
    styles=listFilesURL("login-register.css"),
    scripts=listFilesURL("login-register.js", "login-register-form.js")
  );

@app.route(f"/market/product/<int:product_id>")
def productPage(product_id) :
  target_item = MarketItems().getItemByID(product_id);

  if target_item == False :
    abort(404);
  
  response = make_response(
    render_template(
      "product-page.html", 
      item=target_item,
      item_name=target_item[1],
      styles=listFilesURL("product-page.css")
    )
  )
  response.set_cookie("UnIm@RkEt_last_viewed_item", str(product_id));
  return response;

@app.route("/static/media/market-items/<item_name>")
def marketItemImage(item_name) :
  image = MarketItems().serveItemImage(item_name)

  if image == False : 
    return send_file(os.path.dirname(os.path.realpath(__file__)).replace('\\', "/") + "/static/media/alt-product-image.jpg");

  return image;
  

@app.errorhandler(404)
def notFoundPage(error) :
  return render_template(
    "not-found.html",
    styles=listFilesURL("not-found.css"),
    main_image=url_for("static", filename="media/not-found-image.gif")
  ), 404;