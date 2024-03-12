import mysql.connector;
from flask import url_for, send_file;
from io import BytesIO;
from PIL import Image; 
import os;
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
        return False;
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

def listStylesURL(*style_files) :
  return map(lambda style_file : url_for('static', filename=style_file), style_files);

print(MarketItems().serveItemImage("notebook gamer"));
