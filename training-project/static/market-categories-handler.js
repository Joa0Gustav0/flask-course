function createHeaderMarketCategoriesContainer(data) {
  let content = `
  <ul class="header__container__market-categories-container">
  <a href="/market">
    <li class="header__container__market-categories-container__category">
      <p class="header__container__market-categories-container__category__text">
      Início
      </p>
    </li>
  </a>
    `;

  data.forEach((category, index) => {
    content += `
    <a href="/market?category=${category}">
      <li class="header__container__market-categories-container__category">
        <p class="header__container__market-categories-container__category__text">
        ${category}
        </p>
      </li>
    </a>
    `;

    if (index == data.length - 1) {
      content += `</ul>`;
    }
  });

  renderHeaderMarketCategoriesContainer(content);
}
function renderHeaderMarketCategoriesContainer(content) {
  let header = document.querySelector(".header__container");

  header.innerHTML += content;
}

class MarketCategories {
  static fetchData() {
    let request = new Request(
      window.location.origin + "/api/market-items/categories",
      {
        headers: {
          authorization: "sLGDqCAyM7UnIm@rKeTf9BX58JvxY",
        },
      }
    );

    fetch(request)
      .then(async (response) => await response.json())
      .then((data) => this.consumeData(data))
      .catch((error) =>
        console.log("As categorias de mercado não puderam ser encontradas")
      );
  }

  static consumeData(data) {
    if (!data || "error" in data) {
      return console.log(
        "As categorias de mercado não puderam ser encontradas."
      );
    }

    createHeaderMarketCategoriesContainer(data.content);
  }
}

MarketCategories.fetchData();
