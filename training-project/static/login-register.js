const OVERFLOWING_CONTAINER = document.querySelector(
  ".actions-container__overflow-container"
);
const CONTAINER_CONTROL_BUTTONS = document.querySelectorAll(
  ".actions-container__overflow-container__aside__center-container__ca-container__ca-button"
);

CONTAINER_CONTROL_BUTTONS.forEach((button) => {
  button.addEventListener("click", function (event) {
    let button = event.target;
    let targetAction = getButtonAction(button);

    executeButtonAction(targetAction);
    FormularyValidation.clearInputs();
  });
});

function getButtonAction(targetButton) {
  let buttonClass = targetButton.classList;

  if (buttonClass.contains("set-login-view")) {
    return "login";
  } else {
    return "register";
  }
}

function executeButtonAction(action) {
  OVERFLOWING_CONTAINER.className = "actions-container__overflow-container";
  OVERFLOWING_CONTAINER.classList.add(`on-${action}-view`);
}

const RIGHTS_TEXTS = document.querySelectorAll(".actions-container__overflow-container__rights-text__year-text");
RIGHTS_TEXTS.forEach((text) => {
  text.innerHTML = ", " + new Date().getFullYear();
})