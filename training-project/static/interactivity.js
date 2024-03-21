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

class ImageLoader {
  constructor(imageLoaderID) {
    this.imageLoaderElement = document.getElementById(imageLoaderID);
  }

  stop() {
    this.imageLoaderElement.remove();
  }
}

class AppNotification {
  static unities = 0;

  constructor(message, keywords) {
    AppNotification.unities++;
    this.keywords = keywords;
    this.message = this.highlightKeywords(message);

    this.createNotificationElement();
  }

  highlightKeywords(entryMessage) {
    if (!this.keywords) return entryMessage;

    let outputMessage = "";

    entryMessage = entryMessage.split(" ");
    entryMessage.forEach((word) => {
      outputMessage +=
        (this.keywords.includes(word)
          ? `<span class='highlighted-text'>${word}</span>`
          : word) + " ";
    });

    return outputMessage;
  }

  createNotificationElement() {
    const NOTIFICATION_MODEL = `
    <span class="notification-popup-container" id="notification-${AppNotification.unities}">
      <h1 class="notification-popup-container__headline">
        🦄 Hey! Notificação!
      </h1>
      <p class="notification-popup-container__message-text">
        ${this.message}
      </p>
      <img src="/static/media/unicorn-notification-icon.png" alt="Ícone representativo de um unicórnio de brinquedo" class="notification-popup-container__floating-icon" />
      <button 
        class="notification-popup-container__close-button"
        onclick="AppNotification.deleteNotificationElement(${AppNotification.unities})"
      >
        <ion-icon name="close"></ion-icon>
      </button>
    </span>
    `;

    document.body.innerHTML += NOTIFICATION_MODEL;
  }

  static deleteNotificationElement(elementIDNumber) {
    let targetElement = document.getElementById(
      "notification-" + elementIDNumber
    );

    targetElement.classList.add("out");
    setTimeout(() => targetElement.remove(), 1250);
  }
}

class PasswordProtector {
  static detectNeedForProtection() {
    let inputElements = Array.from(document.getElementsByTagName("input"));
    let passwordInputs = inputElements.filter(
      (input) => input.getAttribute("type") == "password"
    );

    passwordInputs.forEach(
      (inputElement) => new PasswordProtector(inputElement)
    );
  }

  constructor(passwordInputElement) {
    this.passwordInput = passwordInputElement;
    this.createProtectorElement();
  }

  createProtectorElement() {
    let passwordInputLabel = this.passwordInput.parentNode;

    passwordInputLabel.innerHTML += `<ion-icon 
      class="password-protector" 
      name="eye"
      onClick="PasswordProtector.toggleState(this)"
    ></ion-icon>`;
  }

  static toggleState(protector) {
    let parentLabel = protector.parentNode;
    let passwordInput = parentLabel.childNodes[1];

    if (protector.getAttribute("name") == "eye") {
      protector.setAttribute("name", "eye-off");
      protector.classList.add("off");

      passwordInput.setAttribute("type", "text");
    } else {
      protector.setAttribute("name", "eye");
      protector.classList.remove("off");

      passwordInput.setAttribute("type", "password");
    }
  }
}
PasswordProtector.detectNeedForProtection();

//CREATES A NOTIFICATION OBJECT IF ONE IS SENT THROUGH BACK-END 💡
const NOTIFICATION_SENDER = document.querySelector(".notification-sender");
if (NOTIFICATION_SENDER) {
  new AppNotification(
    NOTIFICATION_SENDER.classList[1].replace(/-/g, " "),
    null
  );
  NOTIFICATION_SENDER.remove();
}
