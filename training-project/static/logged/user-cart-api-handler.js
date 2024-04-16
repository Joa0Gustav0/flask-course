const USER_ID = sessionStorage.getItem("logged_userID");

class UserCart {
  static productsInCart = 0;

  getCart() {
    this.method = "GET";
    this.handleActionExecution();
  }

  addToCart(additionalData) {
    this.method = "POST";
    this.entryData = additionalData;
    this.handleActionExecution();
  }

  handleActionExecution() {
    let requestHeaders = {
      authorization: "sLGDqCAyM7UnIm@rKeTf9BX58JvxY",
    };

    if (this.entryData) {
      requestHeaders["inputData"] = this.entryData;
    }

    var APIRequest = new Request(
      document.location.origin + `/api/users/${USER_ID}/cart`,
      {
        method: this.method,
        headers: requestHeaders,
      }
    );

    this.APIRequest = APIRequest;
    this.fetchCart();
  }

  async fetchCart() {
    return fetch(this.APIRequest)
      .then(async (response) => await response.json())
      .then((data) => {
        this.renderCart(data.content);
      });
  }

  renderCart(cartProducts) {
    const CART_CONTAINER = document.querySelector(
      ".cart-sidebar__products-list"
    );
    
    if (!cartProducts || cartProducts.length <= 0) {
      CART_CONTAINER.classList.remove("cart-sidebar__products-list--contains");
      CART_CONTAINER.innerHTML = `
        <div class="cart-sidebar__products-list__empty-sign">
          <img
            src="/static/media/empty-cart-icon.png"
            alt=""
            class="cart-sidebar__products-list__empty-sign__icon"
          />
          <p class="cart-sidebar__products-list__empty-sign__text">
            Ohh... <br />
            Ainda não há <span class="highlighted-text">produtos</span> aqui!
          </p>
        </div>
      `;
      return;
    }

    CART_CONTAINER.innerHTML = "";
    cartProducts.forEach((product) => {
      UserCart.productsInCart++;
      CART_CONTAINER.classList.add("cart-sidebar__products-list--contains");

      CART_CONTAINER.innerHTML += `
        <li class="cart-sidebar__products-list__product-container">
          <div 
            class="image-loader cart-decreased"
            id="cart-item-${UserCart.productsInCart}"
          >
            <div class="image-loader__loading-icon"></div>
          </div>
          <img
            src="${product.picture}"
            onload="new ImageLoader('cart-item-${
              UserCart.productsInCart
            }').stop()"
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
              <div 
                class="cart-sidebar__products-list__product-container__product-informations__bottom-line__quantity-container"
              >
                <button 
                  class="cart-sidebar__products-list__product-container__product-informations__bottom-line__quantity-container__button"
                  onclick="new UserCart().addToCart(JSON.stringify({ productID: ${
                    product.ID
                  } , product_quantity: -1 }))"
                >
                  <ion-icon name='${
                    product.quantity > 1 ? "remove" : "trash-outline"
                  }'></ion-icon>
                </button>
                <p     
                  class="cart-sidebar__products-list__product-container__product-informations__bottom-line__quantity-container__text"
                >
                  ${product.quantity} Uni.
                </p>
                <button 
                  class="cart-sidebar__products-list__product-container__product-informations__bottom-line__quantity-container__button"
                  onclick="new UserCart().addToCart(JSON.stringify({ productID: ${
                    product.ID
                  } , product_quantity: 1 }))"
                >
                  <ion-icon name='add'></ion-icon>
                </button>
              </div>
            </div>
          </div>
        </li>
      `;
    });
  }
}

new UserCart().getCart();
