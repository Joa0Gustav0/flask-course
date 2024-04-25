function renderData(what, where, keep) {
  if (keep) {
    where.innerHTML += what;
  } else {
    where.innerHTML = what;
  }
}

function getFilteringMode() {
  let currentURL = new URL(document.location.href);
  let URLParameters = currentURL.searchParams;

  if (URLParameters.get("search") && !URLParameters.get("category")) {
    return { filter: "search", value: URLParameters.get("search") };
  } else if (URLParameters.get("category") && !URLParameters.get("search")) {
    return { filter: "category", value: URLParameters.get("category") };
  } else if (URLParameters.get("category") && URLParameters.get("search")) {
    return {
      filter: "both",
      value: {
        search: URLParameters.get("search"),
        category: URLParameters.get("category"),
      },
    };
  } else {
    return null;
  }
}

//SUBHEADLINE
function renderSubHeadline(data) {
  let marketSubHeadline = document.querySelector(".content-sub-headline");

  let contentForRendering = data
    ? `🦄 Os <span class="highlighted-text">unicórnios</span> deixaram alguns produtos!!!`
    : `🦄🔎 Ops! Os <span class="highlighted-text">unicórnios</span> não trouxeram os produtos.`;

  renderData(contentForRendering, marketSubHeadline, false);
}
//LAST VIEW CONTAINER
function renderLastViewContainer(data) {
  let relatedCookie = getLastViewCookie();
  if (relatedCookie) {
    let lastViewedItems = getViewedCategoryItems(data, relatedCookie.value);
    listLastViewItems(lastViewedItems);
  }
}
function getLastViewCookie() {
  try {
    let stringifyiedCookie = document.cookie
      .split("; ")
      .filter((value) => value.startsWith("UnIm@RkEt_last_viewed_item"))[0];

    let cookieArray = stringifyiedCookie.split("=");
    let cookieObject = {
      key: cookieArray[0],
      value: Number(cookieArray[1]) - 1,
    };

    return cookieObject;
  } catch {
    return null;
  }
}
function getViewedCategoryItems(data, itemID) {
  let targetViewedItem = data[itemID];
  let lastViewedItemCategory = targetViewedItem.category;

  let allContextItems = data.filter(
    (item) => item.category === lastViewedItemCategory
  );
  let mainContenxtItems = allContextItems.filter((value, index) => index <= 2);

  return mainContenxtItems;
}
function listLastViewItems(items) {
  let container = document.querySelector(".last-view-container");
  container.classList.remove("disabled");

  let containerList = document.querySelector(
    ".last-view-container__products_list"
  );

  let getItemContent = (ID, name, description, price) => `
    <a href="/market/product/${ID}">
      <li class="last-view-container__products_list__product-container">
        <div class="image-loader" id="last-viewed-item-${ID}">
          <div class="image-loader__loading-icon"></div>
        </div>
        <img
          src="/api/images/market-items/${name}"
          alt="Imagem de ${name}"
          onload="new ImageLoader('last-viewed-item-${ID}').stop()"
          class="last-view-container__products_list__product-container__product-image"
        />
        <div
          class="last-view-container__products_list__product-container__product-informations"
        >
          <h1
            class="last-view-container__products_list__product-container__product-informations__product-name"
          >
            ${name}
          </h1>
          <p
            class="last-view-container__products_list__product-container__product-informations__product-description"
          >
            ${description}
          </p>
          <p
            class="last-view-container__products_list__product-container__product-informations__product-price"
          >
            R$ ${price}
          </p>
        </div>
      </li>
    </a>
  `;
  items.map((item) => {
    renderData(
      getItemContent(item.ID, item.name, item.description, item.price),
      containerList,
      true
    );
  });
}
//PRODUCTS LIST
function renderItemsList(data) {
  let list = document.querySelector(".products-list");
  let getItem = (ID, name, description, price) => `
    <a href="/market/product/${ID}">
      <li class="products-list__product-container">
        <div class="image-loader decreased" id="item-${ID}">
          <div class="image-loader__loading-highlight"></div>
        </div>

        <img
          src="/api/images/market-items/${name}"
          alt="Imagem de ${name}"
          onload="new ImageLoader('item-${ID}').stop()"
          class="products-list__product-container__product-image"
        />
        <div class="products-list__product-container__product-informations">
          <h1
            class="products-list__product-container__product-informations__product-name"
          >
            ${name}
          </h1>
          <p
            class="products-list__product-container__product-informations__product-description"
          >
            ${description}
          </p>
          <p
            class="products-list__product-container__product-informations__product-price"
          >
            R$ ${price}
          </p>
        </div>
      </li>
    </a>
  `;

  let paginationIndex = getPaginationData(data).index;

  data.forEach((item, index) => {
    if (
      index >= (paginationIndex - 1) * 10 &&
      index <= (paginationIndex - 1) * 10 + 9
    )
      renderData(
        getItem(item.ID, item.name, item.description, item.price),
        list,
        true
      );
  });
}
//PAGINATION
function renderPaginationIndexer(data) {
  let container = document.querySelector(".container");
  let paginationData = getPaginationData(data);

  let currentURL = new URL(document.location.href);
  let URLParameters = currentURL.searchParams;

  let importantParameters = `${
    URLParameters.get("search") ? "&search=" + URLParameters.get("search") : ""
  }${
    URLParameters.get("category")
      ? "&category=" + URLParameters.get("category")
      : ""
  }`;

  let getContent = () => `
    <div class="pagination-container">
      ${
        paginationData.index <= 1
          ? `<a class="pagination-container__button disabled">
            <ion-icon name="chevron-back"></ion-icon> Anterior
          </a>`
          : `<a href="?index=${
              paginationData.index - 1
            }${importantParameters}" class="pagination-container__button">
            <ion-icon name="chevron-back"></ion-icon> Anterior
          </a>`
      }
      <p class="pagination-container__index-text">${paginationData.index}</p>
      ${
        paginationData.index == paginationData.availableCatalogIndexes
          ? `<a class="pagination-container__button disabled">
            Seguinte <ion-icon name="chevron-forward"></ion-icon>
          </a>`
          : `<a href="?index=${
              paginationData.index + 1
            }${importantParameters}" class="pagination-container__button">
            Seguinte <ion-icon name="chevron-forward"></ion-icon>
          </a>`
      }
    </div>
  `;
  renderData(getContent(), container, true);
}
function getPaginationData(data) {
  let currentURL = new URL(document.location.href);
  let URLParameters = currentURL.searchParams;

  let catalogLength = data.length + 1;
  let paginationIndex = getPaginationIndex(catalogLength, URLParameters);

  return {
    index: paginationIndex,
    catalogLength: catalogLength,
    availableCatalogIndexes: Math.ceil(catalogLength / 10),
  };
}
function getPaginationIndex(catalogLength, URLParameters) {
  let indexingNumber = URLParameters.get("index");
  let catalogIndexingNumber = Math.ceil(catalogLength / 10);

  if (indexingNumber) {
    indexingNumber = Number(indexingNumber);
    if (indexingNumber > catalogIndexingNumber) {
      return catalogIndexingNumber;
    } else if (indexingNumber <= 0) {
      return 1;
    } else {
      return indexingNumber;
    }
  } else {
    return 1;
  }
}

function getFilteredData(data) {
  let filter = MarketItems.filter;

  if (data && filter) {
    switch (filter.filter) {
      case "search":
        return data.filter((item) =>
          item.name.toLowerCase().includes(filter.value.toLowerCase())
        );
      case "category":
        return data.filter(
          (item) =>
            filter.value.toLowerCase() == item.category.toLowerCase() ||
            item.category.toLowerCase().includes(filter.value.toLowerCase())
        );
      case "both":
        return data.filter(
          (item) =>
            item.name
              .toLowerCase()
              .includes(filter.value.search.toLowerCase()) &&
            (filter.value.category.toLowerCase() ==
              item.category.toLowerCase() ||
              item.category
                .toLowerCase()
                .includes(filter.value.category.toLowerCase()))
        );
    }
  }

  return data;
}
function recognizeFilteredData(filteredData) {
  try {
    //IT'S AN ARRAY
    if (filteredData && filteredData.length >= 1) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}
function renderNotFoundSign() {
  let mainContainer = document.querySelector(".no-query-results-sign-container");
  mainContainer.classList.remove("disabled");
}

class MarketItems {
  static filter = getFilteringMode();

  static fetchData() {
    let request = new Request(document.location.origin + "/api/market-items", {
      headers: { authorization: "sLGDqCAyM7UnIm@rKeTf9BX58JvxY" },
    });

    fetch(request)
      .then(async (response) => await response.json())
      .then((data) => MarketItems.consumeData(data));
  }

  static consumeData(data) {
    let filteredData = !data["error"] ? getFilteredData(data) : null;
    let anyResults = recognizeFilteredData(filteredData);

    console.log("Any results?", anyResults);

    renderSubHeadline(anyResults);
    if (data && !data["error"]) {
      renderLastViewContainer(data);
      renderItemsList(filteredData);
      renderPaginationIndexer(filteredData);
    }

    if (!data || data["error"] || !anyResults) {
      renderNotFoundSign();
    }
  }
}

MarketItems.fetchData();
