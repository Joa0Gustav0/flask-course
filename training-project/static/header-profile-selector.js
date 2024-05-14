const HEADER_PROFILE_BUTTON = document.querySelector(
  ".header__container__navbar__nav-buttons--logged__button--profile-button"
);

if (HEADER_PROFILE_BUTTON) {
  HEADER_PROFILE_BUTTON.addEventListener("click", () =>
    toggleHeaderProfileSelector()
);
}

function toggleHeaderProfileSelector() {
  let PROFILE_SELECTOR = document.querySelector(
    ".header__container__navbar__nav-buttons--logged__button__profile-selector"
  );
  
  if (PROFILE_SELECTOR) {
    PROFILE_SELECTOR.classList.toggle("active");
    console.log("Worked", PROFILE_SELECTOR);
  }
}
