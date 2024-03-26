const USER_ID = sessionStorage.getItem("logged_userID");

class UserCart {
  constructor(action, additionData) {
    this.action = action;
    this.handleActionExecution(additionData);
  }

  handleActionExecution(entryData) {
    let requestHeaders = {
      authorization: "sLGDqCAyM7UnIm@rKeTf9BX58JvxY",
    };

    if (this.action === "POST") {
      requestHeaders["inputData"] = JSON.stringify(entryData);
    }

    var APIRequest = new Request(
      document.location.origin + `/api/users/${USER_ID}/cart`,
      {
        method: this.action,
        headers: requestHeaders,
      }
    );

    this.APIRequest = APIRequest;
  }

  async fetchCart() {
    fetch(this.APIRequest)
      .then(async response => await response.json())
      .then(data => console.log(data))
  }
}

//GET METHOD
/* APIRequest = new Request(
  document.location.origin + `/api/users/${userID}/cart`,
  {
    method: "GET",
    headers: {
      authorization: "sLGDqCAyM7UnIm@rKeTf9BX58JvxY",
    },
  }
); */

/* APIRequest = new Request(
  document.location.origin + `/api/users/${userID}/cart`,
  {
    method: "POST",
    headers: {
      authorization: "sLGDqCAyM7UnIm@rKeTf9BX58JvxY",
      inputData: JSON.stringify({ productID: 1, product_quantity: 4 }),
    },
  }
); */

/* fetch(APIRequest)
  .then(async (res) => res.json())
  .then((data) => console.log(data)); */

new UserCart("GET", null).fetchCart()
