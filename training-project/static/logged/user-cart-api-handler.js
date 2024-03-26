userID = sessionStorage.getItem("logged_userID");

//GET METHOD
/* APIRequest = new Request(
  document.location.origin + `/api/users/${userID}/cart`, {
    method: "GET",
    headers: {
      authorization: 'sLGDqCAyM7UnIm@rKeTf9BX58JvxY',
    }
  }
) */

APIRequest = new Request(
  document.location.origin + `/api/users/${userID}/cart`,
  {
    method: "POST",
    headers: {
      authorization: "sLGDqCAyM7UnIm@rKeTf9BX58JvxY",
      inputData: JSON.stringify({ productID: 1, product_quantity: 3 }),
    },
  }
);

fetch(APIRequest)
  .then(async (res) => res.json())
  .then((data) => console.log(data));
