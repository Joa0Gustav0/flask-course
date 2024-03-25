userID = sessionStorage.getItem('logged_userID');

APIRequest = new Request(
  document.location.origin + `/api/users/${userID}/cart`, {
    method: "GET",
    headers: {
      authorization: 'sLGDqCAyM7UnIm@rKeTf9BX58JvxY',
    }
  }
)

fetch(APIRequest)
.then(async res => res.json())
.then(data => console.log(data));