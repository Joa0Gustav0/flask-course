const HIGHLIGHTS_WRAPPER = document.querySelector(".highlights__wrapper");

const HIGHLIGHTS_ELEMENT = document.querySelector(".highlights");
HIGHLIGHTS_ELEMENT.addEventListener("mouseenter", () =>
  HighlightsSlides.setControls(true)
);
HIGHLIGHTS_ELEMENT.addEventListener("mouseleave", () =>
  HighlightsSlides.setControls(false)
);

const HIGHLIGHTS_CONTROLS = document.querySelectorAll(
  ".highlights__controls__button"
);
HIGHLIGHTS_CONTROLS.forEach((element) =>
  element.addEventListener("click", (e) =>
    HighlightsSlides.controlButtonActs(e.target)
  )
);

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

  static controlsEnabled = false;
  static setControls(set) {
    let controlsElements = document.querySelector(".highlights__controls");

    if (set) {
      controlsElements.classList.add("active");
      this.controlsEnabled = true;
    } else {
      controlsElements.classList.remove("active");
      this.controlsEnabled = false;
    }
  }
  static controlButtonActs(button) {
    let slidingDirection = button.classList.contains("left") ? "left" : "right";

    HighlightsSlides.animate(slidingDirection);
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

    containerElement.style.backgroundImage = `linear-gradient(to bottom, ${this.informations.backgroundColor} 65%, transparent)`;
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

  static animate(controls = false) {
    if (controls) {
      if (controls == "right") {
        if (this.slideInView < this.highlightsCountage - 1) {
          this.slideInView++;
        } else {
          this.slideInView = 0;
        }
      } else {
        if (this.slideInView <= 0) {
          this.slideInView = this.highlightsCountage - 1;
        } else {
          this.slideInView--;
        }
      }
    } else if (this.controlsEnabled == false) {
      if (this.slideInView < this.highlightsCountage - 1) {
        this.slideInView++;
      } else {
        this.slideInView = 0;
      }
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
