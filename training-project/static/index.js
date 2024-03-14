class ImagesCarrousel {
  carrousel;
  images;
  defaultImageClass;

  imagesOrder = ["1", "2", "3"];

  constructor(carrouselElement, imagesElements) {
    this.carrousel = carrouselElement;
    this.images = imagesElements;

    this.defaultImageClass = this.images[0].className;

    setInterval(() => this.setImagesOrder(), 2500);

    this.organizeImages();
  }

  setImagesOrder() {
    this.imagesOrder.push(this.imagesOrder.shift());

    this.organizeImages();
  }

  organizeImages() {
    let imagesOrder = this.imagesOrder;

    Array.from(this.images).forEach((image, index) => {
      image.className = this.defaultImageClass;

      image.classList.add("in-view-" + imagesOrder[index]);
    });
  }
}

//Hero Carrousel
var heroCarrousel = new ImagesCarrousel(
  document.querySelector(".hero-section__hero-images-carrousel"),
  document.getElementsByClassName(
    "hero-section__hero-images-carrousel__hero-image"
  )
);

//Bottom Carrousel
var bottomCarrousel = new ImagesCarrousel(
  document.querySelector(".bottom-section__images-carrousel"),
  document.getElementsByClassName("bottom-section__images-carrousel__image")
);
