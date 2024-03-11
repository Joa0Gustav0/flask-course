import mysql.connector;
from flask import url_for;
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
    return Crud().executeCrudAction("read", f"SELECT * FROM marketitems WHERE ItemID = {entry_item_id};")[0];

  def getItemsByCategory(self, last_viewed_product_ID, category) :
    return Crud().executeCrudAction("read", f"SELECT * FROM marketitems WHERE ItemID = {last_viewed_product_ID} UNION SELECT * FROM marketitems WHERE ItemCategory = \'{category}\' AND ItemID != {last_viewed_product_ID} LIMIT 3;");

  def downloadItemsImages(self, target_index) :
    items_images_datas = list();

    for item_ID, item_name, item_price, item_description, item_category in self.getAllItems() :
      items_images_datas.append((int(item_ID), dowloadImageFromCloudStorage(item_name)));
    
    for item_ID, item_image_filename in items_images_datas :
      if item_ID == target_index and target_index :
        return str(item_image_filename);

    return items_images_datas;
     

def dowloadImageFromCloudStorage(entry_blob_name) :
  static_images_folder_path = os.path.dirname(os.path.realpath(__file__)).replace('\\', "/") + "/static/media/market-items/";

  blob_name = str(entry_blob_name).lower().replace(" ", "-");

  if os.path.exists(static_images_folder_path + blob_name + ".jpeg") : return blob_name + ".jpeg";

  try :
    bucket = client_storage_manager.get_bucket("market_items");
    bucket_blob = bucket.blob(blob_name + ".jpeg");

    if bucket_blob.exists() == False :
      return "alt-product-image.jpg";

    file_download__path = static_images_folder_path + blob_name + ".jpeg";

    with open(file_download__path, "wb") as destiny_file :
      client_storage_manager.download_blob_to_file(bucket_blob, destiny_file);
      return blob_name + ".jpeg";
  except Exception as e:
    print(e)
    return "alt-product-image.jpg";


def listStylesURL(*style_files) :
  return map(lambda style_file : url_for('static', filename=style_file), style_files);

print(MarketItems().getItemsByCategory(1, "Notebooks"))
