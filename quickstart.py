from flask import Flask;

app = Flask(__name__);


def getNavigationLinks(*available_pages) :
  return "".join(
    [f"<li><a href=\"{page}\">{page.capitalize()}</a></li>" for page in available_pages]
  );

def getNavigationBar() :
  navigation_links = getNavigationLinks("about", "contact", "products")
  navigation_bar = "<h2>Menu:</h2>\n<ul><li><a href=\"/\">Home</a></li>" + navigation_links + "</ul>";

  return navigation_bar

@app.route("/")
def sayHelloWorld() :
  return "<h1><strong>Home Page</strong></h1>" + getNavigationBar();

@app.route("/")
@app.route("/about")
def getAboutPage() :
  return "<h1><strong>About Page</strong></h1>" + getNavigationBar();

@app.route("/contact")
def getContactPage() :
  return "<h1><strong>Contact Page</strong></h1>" + getNavigationBar();

@app.route("/products")
def getProductsPage() :
  return "<h1>Products Page</h1>" + getNavigationBar();

@app.route("/products/<product_name>")
def getProductInspectionPage(product_name) :
  return getProductsPage() + "<h2>Product Inspection: {}</h2>".format(product_name);