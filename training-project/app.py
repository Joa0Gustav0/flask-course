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
    get_item_image=MarketItems().downloadItemsImages,
    items_inspired_on_last_view=items_inspired_on_last_view,
    styles=listStylesURL("market.css"),
  );

@app.route(f"/market/product/<int:product_id>")
def productPage(product_id) :
  target_item = MarketItems().getItemByID(product_id);

  if target_item == False :
    abort(404);
  
  target_item_image_filename = MarketItems().downloadItemsImages(product_id);
  
  response = make_response(
    render_template(
      "product-page.html", 
      item=target_item,
      product_image=url_for("static", filename="media/market-items/"+target_item_image_filename),
      styles=listStylesURL("product-page.css")
    )
  )
  response.set_cookie("UnIm@RkEt_last_viewed_item", str(product_id));
  return response;
  

@app.errorhandler(404)
def notFoundPage(error) :
  return render_template(
    "not-found.html",
    styles=listStylesURL("not-found.css"),
    main_image=url_for("static", filename="media/not-found-image.gif")
  ), 404;