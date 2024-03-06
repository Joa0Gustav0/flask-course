import mysql.connector;

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