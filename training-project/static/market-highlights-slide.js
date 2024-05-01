const HIGHLIGHTS_WRAPPER = document.querySelector(".highlights__wrapper");

function renderNewSlide(slideContent) {
  HIGHLIGHTS_WRAPPER.innerHTML += slideContent;
}

class HighlightsSlides {
  static highlightsCountage = 0;
  static slideInView = 0;

  constructor(data) {
    this.informations = data;
    HighlightsSlides.highlightsCountage++;
    this.setNewSlide();
    this.setSlideStyle();
  }

  setNewSlide() {
    let headlineElement = `<h1 class="highlights__container__text-container__headline highlights__container__text-container__headline--${HighlightsSlides.highlightsCountage}">${this.informations.headline}</h1>`;
    let subHeadlineElement = `<p class="highlights__container__text-container__sub-headline highlights__container__text-container__sub-headline--${HighlightsSlides.highlightsCountage}">${this.informations.subHeadline}</p>`;
    let imageElement = `<img class="highlights__container__image" src="static/media/highlight-${HighlightsSlides.highlightsCountage}.png" />`;

    let composedContent =
      `<div class="highlights__top-container highlights__top-container--${HighlightsSlides.highlightsCountage}"><div class="highlights__container">` +
      this.getComposedContent({
        headline: headlineElement,
        subHeadline: subHeadlineElement,
        image: imageElement,
      }) +
      `</div></div>`;

    renderNewSlide(composedContent);
  }

  getComposedContent(contentData) {
    switch (this.informations.imageAlign) {
      case "Left":
        return `
        ${contentData.image}
        <aside class="highlights__container__text-container">
          ${contentData.headline}
          ${contentData.subHeadline}
        </aside>
        `;
      case "Center":
        return `
        ${contentData.headline}
        ${contentData.image}
        ${contentData.subHeadline}
        `;
      case "Right":
        return `
        <aside class="highlights__container__text-container">
          ${contentData.headline}
          ${contentData.subHeadline}
        </aside>
        ${contentData.image}
        `;
    }
  }

  setSlideStyle() {
    let headlineElement = document.querySelector(
      `.highlights__container__text-container__headline--${HighlightsSlides.highlightsCountage}`
    );
    let subHeadlineElement = document.querySelector(
      `.highlights__container__text-container__sub-headline--${HighlightsSlides.highlightsCountage}`
    );
    let containerElement = document.querySelector(
      `.highlights__top-container--${HighlightsSlides.highlightsCountage}`
    );

    containerElement.style.backgroundColor = this.informations.backgroundColor;
    headlineElement.style.color = this.informations.textColor;
    subHeadlineElement.style.color = this.informations.textColor;
  }

  static createIndexer() {
    let indexerContainer = document.querySelector(".highlights__slide-indexer");

    indexerContainer.innerHTML += `<div class="highlights__slide-indexer__index-ellipsis highlights__slide-indexer__index-ellipsis--${HighlightsSlides.highlightsCountage}"></div>`;
  }
  static setCurrentIndex() {
    let allIndexesElements = document.querySelectorAll(
      ".highlights__slide-indexer__index-ellipsis"
    );

    allIndexesElements.forEach((element) => {
      if (
        element.classList.contains(
          `highlights__slide-indexer__index-ellipsis--${this.slideInView + 1}`
        )
      ) {
        element.classList.add("current");
      } else {
        element.classList.remove("current");
      }
    });
  }

  static animate() {
    if (this.slideInView < this.highlightsCountage - 1) {
      this.slideInView++;
    } else {
      this.slideInView = 0;
    }

    let screenWidth = window.innerWidth - 10;
    HIGHLIGHTS_WRAPPER.style.transform = `translateX(-${
      screenWidth * this.slideInView
    }px)`;
    this.setCurrentIndex();
  }
}

fetch("./static/market-highlights.json")
  .then(async (response) => await response.json())
  .then((data) => {
    data.forEach((element) => {
      new HighlightsSlides(element);
      HighlightsSlides.createIndexer();
    });

    HighlightsSlides.setCurrentIndex();
  });

setInterval(() => HighlightsSlides.animate(), 3000);
