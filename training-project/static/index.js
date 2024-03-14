class HeroImagesCarrousel {
  static carrousel = document.querySelector(
    ".hero-section__hero-images-carrousel"
  );
  static heroImages = document.getElementsByClassName(
    "hero-section__hero-images-carrousel__hero-image"
  );

  static imagesOrder = ["1", "2", "3"];

  static setImagesOrder() {
    HeroImagesCarrousel.imagesOrder.push(
      HeroImagesCarrousel.imagesOrder.shift()
    );

    HeroImagesCarrousel.organizeImages();
  }

  static organizeImages() {
    Array.from(HeroImagesCarrousel.heroImages).forEach(function (image, index) {
      image.className = "hero-section__hero-images-carrousel__hero-image";

      image.classList.add("in-view-" + HeroImagesCarrousel.imagesOrder[index]);
    });
  }
}

HeroImagesCarrousel.organizeImages();
setInterval(() => HeroImagesCarrousel.setImagesOrder(), 2500);
