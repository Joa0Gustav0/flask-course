from flask import Flask, render_template, url_for, abort, redirect, request, session, make_response, send_file, flash;
app = Flask(__name__);
app.secret_key = "M4dTAj8qWFEUnIm@rKeTdQmhgKwB6Z7";

from data import MarketItems, Users, UserCart, APIsStatus, SignValidation, listFilesURL; 
import os;
import ast;
import json;

@app.route("/")
def index() :
  return render_template(
    "index.html",
    styles=listFilesURL('index.css'),
    scripts=listFilesURL("index.js")
  );

@app.route("/market")
def market() :
  return render_template(
    "market.html", 
    styles=listFilesURL("market.css"),
    scripts=listFilesURL("market.js")
  );

@app.route("/login", methods=["GET", "POST"])
@app.route("/register", methods=["GET", "POST"])
def login() :
  if session.get("logged_user") :
    return redirect("/user/profile");

  if "login" in request.path :
    focus_action = "on-login-view";
  else :
    focus_action = "on-register-view";
  
  if request.method == "POST" :
    if focus_action == "on-login-view" :
      login_form_data = {
        "username" : request.form.get("login-username"),
        "password" : request.form.get("login-password")
      }

      logged = SignValidation.login(login_form_data) if None not in list(login_form_data.values()) else False;

      if not logged.get("error"):
        session["logged_user"] = logged;

        return redirect("/user/profile");
      elif logged.get("error") :
        flash(logged.get("error"), "information");

        return redirect("/login");
      else :
        flash("A ação de login não pode ser completada. Tente novamente mais tarde.", "information");

        return redirect("/login");
  
    if focus_action == "on-register-view" :
      registration_status = SignValidation.register({
        "username" : request.form.get("username"),
        "email" : request.form.get("email"),
        "password" : request.form.get("password")
      });
    
      flash(registration_status["message"], "information");

      if registration_status["ok"] :
        return redirect("/login");
      else :
        return redirect("/register");


  return render_template(
    "login-register.html",
    container_focus=focus_action,
    users_in_database=Users.getUsers(),
    styles=listFilesURL("login-register.css"),
    scripts=listFilesURL("login-register.js", "login-register-form.js")
  );

@app.route("/user/profile")
def userProfile() :
  if not session.get("logged_user") :
    flash("Você precisa fazer login para visualizar o seu perfil de usuário aqui no UniMarket!", "information");
    return redirect("/login");

  return render_template("profile.html");

@app.route("/logout")
def logout() :
  if session.get("logged_user") :
    session.pop("logged_user", None);
    flash("Você se desconectou. 🔌", "information")

  return redirect("/login");

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

@app.route("/api/market-items")
def marketItems() :
  authorization = APIsStatus.validateAuthorization();
  if authorization.get('error') :
    return authorization;

  items = MarketItems().getAllItems();

  items_JSON = [
    {
      "ID" : item_ID,
      "name" : item_name,
      "price" : item_price,
      "description" : item_description,
      "category" : item_category
    } for item_ID, item_name, item_price, item_description, item_category in items
  ]
  return items_JSON;
  

@app.route("/api/images/market-items/<item_name>")
def marketItemImage(item_name) :
  image = MarketItems().serveItemImage(item_name)

  if image == False : 
    return send_file(os.path.dirname(os.path.realpath(__file__)).replace('\\', "/") + "/static/media/alt-product-image.jpg");

  return image;

@app.route("/api/users/<int:user_ID>/cart", methods=["GET", "POST"])
def userCart(user_ID) :
  authorization = APIsStatus.validateAuthorization();
  if authorization.get('error') :
    return authorization;

  action = request.method;

  if action == "GET" :
    return UserCart(user_ID).getCart(True);
  elif action == "POST" :
    addition_data = ast.literal_eval(request.headers.get("inputData"));
    return UserCart(user_ID).addToCart(addition_data);
  else :
    return APIsStatus.sendError("A valid action was not set.");



@app.route("/api/login-validation", methods=["GET"])
def registerValidation() :
  authorization = APIsStatus.validateAuthorization();
  if authorization.get('error') :
    return authorization;

  if not request.headers.get("data") or not request.headers.get("dataType") :
    return APIsStatus.sendError('Data for validation does not follow the validation parameters.');

  return SignValidation.checkAlreadyInUse(
    request.headers["data"], 
    request.headers["dataType"]
  );

@app.errorhandler(404)
def notFoundPage(error) :
  return render_template(
    "not-found.html",
    styles=listFilesURL("not-found.css"),
    main_image=url_for("static", filename="media/not-found-image.gif")
  ), 404;