function renderData(what, where, keep) {
  if (keep) {
    where.innerHTML += what;
  } else {
    where.innerHTML = what;
  }
}

class MarketItems {
  static fetchData() {
    let request = new Request(document.location.origin + "/api/market-items", {
      headers: {
        authorization: "sLGDqCAyM7UnIm@rKeTf9BX58JvxY",
      },
    });

    fetch(request)
      .then(async (response) => await response.json())
      .then((data) => MarketItems.consumeData(data));
  }

  static consumeData(data) {
    let marketSubHeadline = document.querySelector(".content-sub-headline");
    renderData(
      !data || "error" in data
        ? `🦄🔎 Ops! Os <span class="highlighted-text">unicórnios</span> não trouxeram
      os produtos.`
        : `🦄 Os <span class="highlighted-text">unicórnios</span> deixaram alguns
        produtos!!!`,
      marketSubHeadline,
      false
    );

    try {
      let lastViewCookieArray = document.cookie
        .split("; ")
        .filter((value) => value.startsWith("UnIm@RkEt_last_viewed_item"))[0]
        .split("=");
      let lastViewCookie = {
        key: lastViewCookieArray[0],
        value: Number(lastViewCookieArray[1]),
      };
      if (data && lastViewCookie) {
        let lastViewedCategory = data[lastViewCookie.value - 1].category;
        let categoryItems = data.filter(
          (item) => item.category === lastViewedCategory
        );

        let lastViewedItemsContainer = document.querySelector(
          ".last-view-container"
        );
        lastViewedItemsContainer.innerHTML = `
          <p class="last-view-container__headline">
            <span class="highlighted-text">Olha só!</span> Produtos inspirados em seu
            <span class="highlighted-text">último visto</span>?
          </p>
          <ul class="last-view-container__products_list"></ul>
        `;
        let lastViewProductsList = document.querySelector(
          ".last-view-container__products_list"
        );
        categoryItems.map((item, index) => {
          if (index <= 2)
            renderData(
              `
            <a href="/market/product/${item.ID}">
              <li class="last-view-container__products_list__product-container">
                <div class="image-loader" id="last-viewed-item-${item.ID}">
                  <div class="image-loader__loading-icon"></div>
                </div>
                <img
                  src="/api/images/market-items/${item.name}"
                  alt="Imagem de ${item.name}"
                  onload="new ImageLoader('last-viewed-item-${item.ID}').stop()"
                  class="last-view-container__products_list__product-container__product-image"
                />
                <div
                  class="last-view-container__products_list__product-container__product-informations"
                >
                  <h1
                    class="last-view-container__products_list__product-container__product-informations__product-name"
                  >
                    ${item.name}
                  </h1>
                  <p
                    class="last-view-container__products_list__product-container__product-informations__product-description"
                  >
                    ${item.description}
                  </p>
                  <p
                    class="last-view-container__products_list__product-container__product-informations__product-price"
                  >
                    R$ ${item.price}
                  </p>
                </div>
              </li>
            </a>
            `,
              lastViewProductsList,
              true
            );
        });
      }
    } catch {}

    let currentURL = new URL(document.location.href);
    let URLParameters = currentURL.searchParams;
    let productsQuantity = data.length + 1;
    let paginationIndex = URLParameters.get("index")
      ? Number(URLParameters.get("index")) > Math.ceil(productsQuantity / 10)
        ? Math.ceil(productsQuantity / 10)
        : Number(URLParameters.get("index")) <= 0
        ? 1
        : Number(URLParameters.get("index"))
      : 0;

    let productsList = document.querySelector(".products-list");
    productsList.innerHTML = "";
    if (data) {
      data.forEach((value, index) => {
        if (
          index >= (paginationIndex - 1) * 10 &&
          index <= (paginationIndex - 1) * 10 + 9
        )
          renderData(
            `
          <a href="/market/product/${value.ID}">
            <li class="products-list__product-container">
              <div class="image-loader decreased" id="item-${value.ID}">
                <div class="image-loader__loading-highlight"></div>
              </div>

              <img
                src="/api/images/market-items/${value.name}"
                alt="Imagem de ${value.name}"
                onload="new ImageLoader('item-${value.ID}').stop()"
                class="products-list__product-container__product-image"
              />
              <div class="products-list__product-container__product-informations">
                <h1
                  class="products-list__product-container__product-informations__product-name"
                >
                  ${value.name}
                </h1>
                <p
                  class="products-list__product-container__product-informations__product-description"
                >
                  ${value.description}
                </p>
                <p
                  class="products-list__product-container__product-informations__product-price"
                >
                  R$ ${value.price}
                </p>
              </div>
            </li>
          </a>
          `,
            productsList,
            true
          );
      });

      let container = document.querySelector(".container");
      renderData(
        `
      <div class="pagination-container">
        ${
          paginationIndex <= 1
            ? `<a class="pagination-container__button disabled">
              <ion-icon name="chevron-back"></ion-icon> Anterior
            </a>`
            : `<a href="?index=${
                paginationIndex - 1
              }" class="pagination-container__button">
              <ion-icon name="chevron-back"></ion-icon> Anterior
            </a>`
        }
        <p class="pagination-container__index-text">${paginationIndex}</p>
        ${
          paginationIndex == Math.ceil(productsQuantity / 10)
            ? `<a class="pagination-container__button disabled">
              Seguinte <ion-icon name="chevron-forward"></ion-icon>
            </a>`
            : `<a href="?index=${
                paginationIndex + 1
              }" class="pagination-container__button">
              Seguinte <ion-icon name="chevron-forward"></ion-icon>
            </a>`
        }
      </div>
      `,
        container,
        true
      );
    }
  }
}

MarketItems.fetchData();
