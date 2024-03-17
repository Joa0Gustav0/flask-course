const REGISTERING_INPUTS = document.querySelectorAll(".registering-input");
REGISTERING_INPUTS.forEach((input) => {
  input.addEventListener("input", () => new FormularyValidation());
});

class FormularyValidation {
  formularyType = FormularyValidation.getType();
  formularyInputs = this.getInputs();

  constructor() {
    if (this.formularyType == "login") {
      this.validateLoginForm();
    } else {
      this.validateRegisteringForm();
    }
  }

  static getType() {
    let targetActionClass = OVERFLOWING_CONTAINER.classList[1];
    let formularyType = targetActionClass.includes("login")
      ? "login"
      : "register";

    return formularyType;
  }

  getInputs() {
    if (this.formularyType == "login") {
      return {
        username: createInputObject("login-username-input"),
        password: createInputObject("login-password-input"),
      };
    } else {
      return {
        username: createInputObject("username-input"),
        email: createInputObject("email-input"),
        password: createInputObject("password-input"),
      };
    }
  }

  validateLoginForm() {}

  validateRegisteringForm() {
    let inputKeys = Object.keys(this.formularyInputs);

    let validationsResults = [];
    inputKeys.forEach((key) => {
      validationsResults.push(
        FormularyValidation.checkInput(this.formularyInputs[key])
      );
    });

    FormularyValidation.checkValidationResult(validationsResults);
  }

  static checkInput(input) {
    switch (input.type) {
      case "username":
        return this.validateUsername(input);
      case "email":
        return this.validateEmail(input);
      case "password":
        return this.validatePassword(input);
    }
  }

  static validateUsername(input) {
    if (input.value.trim() == "") {
      return this.displayValidationMessage(input, "error", "");
    }
    if (input.value.trim().includes(" ")) {
      return this.displayValidationMessage(
        input,
        "error",
        "O usuário não pode conter espaços."
      );
    }
    if (String(input.value).length < 8) {
      return this.displayValidationMessage(
        input,
        "error",
        "O usuário deve conter ao menos 8 caracteres."
      );
    }
    if (verifyPresence(input.value, "numbers")) {
      return this.displayValidationMessage(
        input,
        "error",
        "O usuário não deve conter números."
      );
    }

    return this.displayValidationMessage(input, "success", "");
  }
  static validatePassword(input) {
    if (input.value.trim() == "") {
      return this.displayValidationMessage(input, "error", "");
    }
    if (input.value.trim().includes(" ")) {
      return this.displayValidationMessage(
        input,
        "error",
        "A senha não pode conter espaços."
      );
    }
    if (String(input.value).length < 8) {
      return this.displayValidationMessage(
        input,
        "error",
        "A senha deve conter ao menos 8 caracteres."
      );
    }
    if (
      !verifyPresence(input.value, "letters") ||
      !verifyPresence(input.value, "numbers")
    ) {
      return this.displayValidationMessage(
        input,
        "error",
        "A senha deve conter ao menos uma letra e um número."
      );
    }
    if (!verifyPresence(input.value, "special-characters")) {
      return this.displayValidationMessage(
        input,
        "error",
        "A senha deve conter ao menos um caractere especial."
      );
    }

    return this.displayValidationMessage(input, "success", "");
  }
  static validateEmail(input) {
    if (input.value.trim() == "") {
      return this.displayValidationMessage(input, "error", "");
    }
    if (input.value.trim().includes(" ")) {
      return this.displayValidationMessage(
        input,
        "error",
        "O email não pode conter espaços."
      );
    }
    if (!verifyEmailProviders(input.value)) {
      return this.displayValidationMessage(
        input,
        "error",
        "O email não possui um provedor válido\n(Gmail, Yahoo, Outlook, Hotmail)."
      );
    }

    return this.displayValidationMessage(input, "success", "");
  }
  static displayValidationMessage(input, type, message) {
    input.errorTextElement.innerHTML = message;
    if (type == "error") {
      return false;
    } else {
      return true;
    }
  }

  static checkValidationResult(results) {
    let validationFail = false;
    results.forEach((result) => {
      if (result == false) validationFail = true;
    });

    if (!validationFail) {
      this.manageFormSubmitButtons("enable");
    } else {
      this.manageFormSubmitButtons("disable");
    }
  }
  static manageFormSubmitButtons(mode) {
    let formButton;
    if (this.getType() == "login") {
      formButton = document.getElementById("login-submit-button");
    } else {
      formButton = document.getElementById("registering-submit-button");
    }

    if (mode == "enable") {
      formButton.removeAttribute("disabled");
    } else {
      formButton.setAttribute("disabled", "");
    }
  }
  static clearInputs() {
    let allInputs = document.querySelectorAll(
      ".actions-container__aside__form__input-label__input"
    );
    let allValidationMessageElements = document.querySelectorAll(
      ".actions-container__aside__form__input-label__input-error-text"
    );

    allInputs.forEach((input) => {
      input.value = "";
    });
    allValidationMessageElements.forEach((element) => {
      element.innerHTML = "";
    });

    new FormularyValidation();
  }
}

function createInputObject(inputID) {
  let targetElement = document.getElementById(inputID);

  return {
    type: getInputType(inputID),
    value: targetElement.value,
    errorTextElement: document.getElementById(inputID + "-error"),
  };
}
function getInputType(inputID) {
  if (inputID.includes("username")) {
    return "username";
  } else if (inputID.includes("email")) {
    return "email";
  } else if (inputID.includes("password")) {
    return "password";
  }
}

function verifyPresence(value, mirrorValues) {
  value = String(value);

  if (mirrorValues == "letters") {
    mirrorValues = "abcdefghijklmnopqrstuvwxyz";
  } else if (mirrorValues == "numbers") {
    mirrorValues = "0123456789";
  } else if (mirrorValues == "special-characters") {
    mirrorValues = "!@#$%&*";
  }

  let isPresent = false;
  [...mirrorValues].forEach((letter) => {
    [...value].forEach((valueUnity) => {
      if (valueUnity == letter) isPresent = true;
    });
  });

  return isPresent;
}
function verifyEmailProviders(value) {
  let emailProviders = [
    "@gmail.com",
    "@yahoo.com",
    "@outlook.com",
    "@hotmail.com",
  ];

  let containsProvider = false;
  emailProviders.forEach((provider) => {
    if (value.includes(provider)) {
      containsProvider = true;
    }
  });

  return containsProvider;
}
