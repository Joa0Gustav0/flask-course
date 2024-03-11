const HEADER = document.querySelector(".header");

class HeaderToggler {
  static lastYAxisScrollPoint = window.screenTop;
  static YAxisScrollSense;

  static execute() {
    HeaderToggler.YAxisScrollSense = HeaderToggler.handleScrollSense();
    HeaderToggler.lastYAxisScrollPoint = window.scrollY;

    HeaderToggler.toogleHeader();
  }

  static handleScrollSense() {
    if (HeaderToggler.lastYAxisScrollPoint > window.scrollY) {
      return "Upwards";
    } else {
      return "Downwards";
    }
  }

  static toogleHeader() {
    if (HeaderToggler.YAxisScrollSense == "Upwards") {
      HEADER.classList.remove("disabled");
    } else if (window.scrollY >= 40) {
      HEADER.classList.add("disabled");
    }
  }
}

window.onscroll = () => HeaderToggler.execute();