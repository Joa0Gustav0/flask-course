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

      UserCart.removeCartPaymentResultsContainer();

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

    UserCart.removeCartPaymentResultsContainer();
    UserCart.createCartPaymentResultsContainer(cartProducts);
  }

  static getPaymentInformations(cartData) {
    if (cartData.length < 2) {
      return {
        quantity: cartData[0].quantity,
        subtotal:
          "R$" + String((cartData[0].price * cartData[0].quantity).toFixed(2)),
        shipping:
          "R$" +
          String(
            (0.01 * (cartData[0].price * cartData[0].quantity)).toFixed(2)
          ),
        total:
          "R$" +
          String(
            ((cartData[0].price * cartData[0].quantity) + 0.01 * (cartData[0].price * cartData[0].quantity)).toFixed(2)
          ),
      };
    }

    let productsQuantity = cartData.reduce(
      (previous, current) => previous.quantity + current.quantity
    );
    let productsPrice = cartData.reduce(
      (previous, current) =>
        previous.price * previous.quantity + current.price * current.quantity
    );
    let shippingPrice = 0.01 * productsPrice;
    let totalPrice = productsPrice + shippingPrice;

    return {
      quantity: productsQuantity,
      subtotal: "R$" + String(productsPrice.toFixed(2)),
      shipping: "R$" + String(shippingPrice.toFixed(2)),
      total: "R$" + String(totalPrice.toFixed(2)),
    };
  }
  static removeCartPaymentResultsContainer() {
    let paymentResultsContainer = document.querySelector(
      ".cart-sidebar__payment-results"
    );

    if (paymentResultsContainer) {
      paymentResultsContainer.remove();
    }
  }
  static createCartPaymentResultsContainer(cartData) {
    let cart = document.querySelector(".cart-sidebar");

    let paymentInformations = this.getPaymentInformations(cartData);

    cart.innerHTML += `
    <div class="cart-sidebar__payment-results">
      <div class="cart-sidebar__payment-results__information">
        <p class="cart-sidebar__payment-results__information__title">
          Produtos <span>(${paymentInformations.quantity})</span>
        </p>
        <p class="cart-sidebar__payment-results__information__sub-title">
          ${paymentInformations.subtotal}
        </p>
      </div>
      <div class="cart-sidebar__payment-results__information">
        <p class="cart-sidebar__payment-results__information__title">
          Envios
        </p>
        <p class="cart-sidebar__payment-results__information__sub-title">
          ${paymentInformations.shipping}
        </p>
      </div>
      <div
        class="cart-sidebar__payment-results__information cart-sidebar__payment-results__information--total"
      >
        <p class="cart-sidebar__payment-results__information__title">Total</p>
        <p class="cart-sidebar__payment-results__information__sub-title">
          ${paymentInformations.total}
        </p>
      </div>
      <button class="cart-sidebar__payment-results__cabutton">
        Continuar a Compra
      </button>
    </div>
    `;
  }
}

new UserCart().getCart();
