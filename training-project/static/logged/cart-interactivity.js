const CART_SIDEBAR = document.querySelector(".cart-sidebar");
const SCREEN_SAVER = document.querySelector(".screen-saver");
const HEADER_CART_TOGGLE_BUTTON = document.querySelector(
  ".header__container__navbar__nav-buttons__cart-button"
);
const CART_TOGGLE_BUTTON = document.querySelector(".cart-sidebar__tab-button");

function toggleCartSidebar() {
  SCREEN_SAVER.classList.toggle("active");
  CART_SIDEBAR.classList.toggle("active");
}

CART_TOGGLE_BUTTON.addEventListener("click", () => toggleCartSidebar());
HEADER_CART_TOGGLE_BUTTON.addEventListener("click", () => toggleCartSidebar());

function addToCartFromProductPage(productID) {
  new UserCart().addToCart(JSON.stringify({ productID: Number(productID) , product_quantity: 1 }));
  SCREEN_SAVER.classList.add("active");
  CART_SIDEBAR.classList.add("active");
}
