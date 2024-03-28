const USER_ID = sessionStorage.getItem("logged_userID");

class UserCart {
  static productsInCart = 0;

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
    return fetch(this.APIRequest)
      .then(async (response) => await response.json())
      .then((data) => this.renderCart(data.content));
  }

  renderCart(cartProducts) {
    const CART_CONTAINER = document.querySelector(
      ".cart-sidebar__products-list"
    );
    cartProducts.forEach((product) => {
      UserCart.productsInCart++;

      CART_CONTAINER.innerHTML += `
        <li class="cart-sidebar__products-list__product-container">
          <div class="image-loader decreased" id="cart-item-${UserCart.productsInCart}">
            <div class="image-loader__loading-icon"></div>
          </div>
          <img
            src="${product.picture}"
            onload="new ImageLoader('cart-item-${UserCart.productsInCart}').stop()"
            class="cart-sidebar__products-list__product-container__product-picture"
          />
          <div
            class="cart-sidebar__products-list__product-container__product-informations"
          >
            <h1
              class="cart-sidebar__products-list__product-container__product-informations__name"
            >${product.name}</h1>
            <p
              class="cart-sidebar__products-list__product-container__product-informations__description"
            >${product.description}</p>
            <div
              class="cart-sidebar__products-list__product-container__product-informations__bottom-line"
            >
              <p
                class="cart-sidebar__products-list__product-container__product-informations__bottom-line__price"
              >R$ ${product.price}</p>
            </div>
          </div>
        </li>
      `;
    });
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

new UserCart("GET", null).fetchCart();
