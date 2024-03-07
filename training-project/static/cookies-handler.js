class CookiesHandler {
  static setPermissionCookies() {
    let dateAndTime = `${
      new Date().getMonth() + 1
    }/${new Date().getDate()}/${new Date().getFullYear()} at ${new Date().getHours()}:${new Date().getMinutes()}`;
    
    console.log("Cookies usage permission was conceded by user.");
    
    document.cookie = `UnIm@RkEt_cookies_usage_permission=Cookies usage permission was conceded by user on ${dateAndTime}.`;
  }
}

const COOKIES_POPUP_SUBMIT_BUTTON = document.querySelector(
  ".cookies-request-container__submit-button"
);

COOKIES_POPUP_SUBMIT_BUTTON.addEventListener("click", () => CookiesHandler.setPermissionCookies());
