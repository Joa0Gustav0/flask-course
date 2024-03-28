import mysql.connector;
from flask import url_for, send_file, request;
from io import BytesIO;
from PIL import Image; 
import os;
import ast;
from google.cloud import storage;

google_credentials_file_name = "unimarket-416714-a351455fb7b2.json";
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.dirname(os.path.realpath(__file__)).replace('\\', "/") + f"/{google_credentials_file_name}";

client_storage_manager = storage.Client();

class InvalidCrudAction :
  def __init__(self) :
    print("⚠ This is not a valid CRUD action.");

class Crud :
  def getCRUDHandlers(self) :
    try :
      database_connection = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "2409SQLGustav@@2409",
        database = "unimarket"
      )
      cursor = database_connection.cursor();

      handlers = {
        "connection" : database_connection,
        "cursor" : cursor,
      }

      return handlers;
    except :
      print("⚠ Some error ocurred while trying to connect to database.")
      return False;


  def executeCrudAction(self, action, command) :
    if action not in ["create", "read", "update", "delete"] :
      InvalidCrudAction()
      return False;
  
    crud_handlers = self.getCRUDHandlers()

    try :
      crud_handlers["cursor"].execute(command);

      if action != "read" :
        crud_handlers["connection"].commit();

        crud_handlers["cursor"].close();
        crud_handlers["connection"].close();
        return True;
      else :
        query = crud_handlers["cursor"].fetchall();

        crud_handlers["cursor"].close();
        crud_handlers["connection"].close();
        return query;
    except Exception:
      return False;

class MarketItems :
  def getAllItems(self) :
    return Crud().executeCrudAction("read", "SELECT * FROM marketitems;");

  def getItemByID(self, entry_item_id) :
    try :
      return Crud().executeCrudAction("read", f"SELECT * FROM marketitems WHERE ItemID = {entry_item_id};")[0];
    except :
      return False;

  def getItemsByCategory(self, last_viewed_product_ID, category) :
    return Crud().executeCrudAction("read", f"SELECT * FROM marketitems WHERE ItemID = {last_viewed_product_ID} UNION SELECT * FROM marketitems WHERE ItemCategory = \'{category}\' AND ItemID != {last_viewed_product_ID} LIMIT 3;");

  def serveItemImage(self, item_name) :
    try :
      bucket = client_storage_manager.get_bucket("market_items");
      bucket_blob = bucket.blob(str(item_name).lower().replace(" ", "-") + ".jpeg");

      image_bytes = bucket_blob.download_as_bytes();
    
      converted_image = Image.open(BytesIO(image_bytes));

      image_IO = BytesIO();
      converted_image.save(image_IO, "JPEG", quality=70);
      image_IO.seek(0);

      return send_file(image_IO, mimetype="image/jpeg");
    
    except :
      return False;

class UserCart :
  def __init__(self, userID) :
    self.cartID = userID;
    self.cartExists = self.checkCartExistence();

  def checkCartExistence(self) :
    cart_exists = self.getCart(False);
  
    return cart_exists;

  def addToCart(self, addition_data) :  
    formated_data = UserCart.formatCartAdditionData(addition_data);

    if isinstance(formated_data, dict) : 
      return APIsStatus.sendError("Um erro inesperado ocorreu ao tentar adicionar o produto ao carrinho. Tente novamente mais tarde.1");

    try :
      if not self.cartExists.get('error') :
        current_cart_content = self.cartExists.get('content');
        current_cart_content.append(formated_data);

        new_cart_content = UserCart.formatCartListData(current_cart_content);


        crud_status = Crud().executeCrudAction(
          "update", 
          f"UPDATE customerscarts SET CartContent = '{new_cart_content}' WHERE CustomerID = {self.cartID};"
        );
      else :
        crud_status = Crud().executeCrudAction(
          "create", 
          f"INSERT INTO customerscarts (CustomerID, CartContent) VALUES ({self.cartID},'[{formated_data}]');"
        );
      
      if crud_status == False : raise;
    
      return APIsStatus.sendSuccess(
        "O produto foi adicionado ao carrinho com sucesso!", self.getCart(True)
      );
    except :
      return APIsStatus.sendError("Um erro inesperado ocorreu ao tentar adicionar o produto ao carrinho. Tente novamente mais tarde.2");

  def formatCartAdditionData(entry_data) :
    try :
      if not entry_data.get('productID') or not entry_data.get('product_quantity') :
        raise Exception;
  
      return [entry_data.get('productID'), entry_data.get('product_quantity')];
  
    except Exception:
      return APIsStatus.sendError('Data does not satisfies cart addition process parameters.');

  def formatCartListData(entry_list) :
    products_in_list = [];

    for element in entry_list :
      if [element[0], 0] not in products_in_list : 
        products_in_list.append([element[0], 0]);
  
    for product in products_in_list :
      for element in entry_list :
        if element[0] == product[0] :
          product[1] += element[1];
  
    return products_in_list;

  def getCart(self, details) :
    string_cart = Crud().executeCrudAction(
      "read", 
      f"SELECT CartContent FROM customerscarts WHERE CustomerID = {self.cartID};"
    );

    if string_cart :
      cart = ast.literal_eval(string_cart[0][0]);

      return APIsStatus.sendSuccess(
        "O carrinho foi encontrado.", 
        UserCart.getCartContentInformations(cart) if details else cart
      )
    else :
      return APIsStatus.sendError(404);

  def getCartContentInformations(entry_cart) :
    informations = [];

    try :
      for product in entry_cart :
        target_productID = product[0];

        product_data = MarketItems().getItemByID(target_productID);

        informations.append({
          'name' : product_data[1],
          'price' : product_data[2],
          'picture' : f'/api/images/market-items/{product_data[1]}',
          'description' : product_data[3],
          'quantity' : product[1]
        })

      return informations;
    except Exception :
      return 404;
    



def listFilesURL(*style_files) :
  return map(lambda style_file : url_for('static', filename=style_file), style_files);

class Users :
  def getUsers() :
    try :
      users_data = Crud().executeCrudAction("read", "SELECT CustomerUsername, CustomerEmail FROM customers;");

      users_list = [{
        'username' : user_name,
        'email' : user_email
      } for user_name, user_email in users_data];
    
      return users_list;
  
    except :
      return None;
  def getUserByID(userID) :
    query = Crud().executeCrudAction("read", f"SELECT * FROM customers WHERE CustomerID = {userID};");
    if query :
      return query[0];
    else :
      return None;

class APIsStatus :
  def validateAuthorization() :
    API_AUTHORIZATION_CODE = 'sLGDqCAyM7UnIm@rKeTf9BX58JvxY';

    if not request.headers.get('authorization') :
      return APIsStatus.sendError('API authorization not provided.');
    elif not request.headers['authorization'] == API_AUTHORIZATION_CODE:
      return APIsStatus.sendError('Incorrect API authorization code.');

    return APIsStatus.sendSuccess("Authorization provided.", None);

  def sendError(message) :
    return { 'error' : message };
  def sendSuccess(message, content) :
    return { 
      'success' : message,
      'content' : content
    };

class SignValidation :
  def checkAlreadyInUse(data_for_validation, data_type) :
    users = Users.getUsers();

    if users == None :
      return APIsStatus.sendError('Could not contact database for validation. (400)');

    data_already_in_usage_count = list(filter(lambda user : user[data_type] == data_for_validation, users));
    already_in_use = len(data_already_in_usage_count) > 0;

    return APIsStatus.sendSuccess(
      'Validation ocurred successfully.', 
      {
        'alreadyUsed' : already_in_use,
        'message' : f'{data_type.capitalize()} is already in use.' if already_in_use else f'{data_type.capitalize()} can be used.'
      }
    )

  def register(user_data) :
    try :
      if None in list(user_data.values()) : raise Exception();

      Crud().executeCrudAction(
        "create", 
        "INSERT INTO customers (CustomerUsername, CustomerEmail, CustomerPassword) VALUES ('{}', '{}', '{}');".format(
          user_data["username"],
          user_data["email"],
          user_data["password"]
        )
      );

      return {
        "message" : "A sua conta foi criada com sucesso. Faça login e conheça o que o UniMarket tem a te oferecer! 🎉",
        "ok" : True
      };
    except :
      return {
        "message" : "Um erro inesperado ocorreu e seu registro não pode ser concluido. Tente novamente mais tarde.",
        "ok" : False
      };

  def login(login_data) :
    user_registerID = SignValidation.matchRegister(login_data);
    if not user_registerID : return { 'error' : 'Nenhum usuário com esses dados de login foi encontrado. 🔎' };
  
    logged_user = Users.getUserByID(user_registerID);
    if not logged_user : return { 'error' : 'Um erro inesperado ocorreu durante a tentativa de login. Tente novamente mais tarde.' };

    userID, user_username, user_email, user_password = logged_user;

    return { 
      "ID" : userID,
      "username" : user_username,
      "email" : user_email,
    };
  def matchRegister(login_data) :
    try :
      matching_registerID = Crud().executeCrudAction(
        "read", 
        "SELECT CustomerID FROM customers WHERE CustomerUsername = '{}' AND CustomerPassword = '{}';".format(
          login_data["username"],
          login_data["password"]
        )
      )[0][0];

      return matching_registerID;
    except :
      return None;