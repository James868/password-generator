const form = document.querySelector(".form");
const lengthSetting = document.querySelector(".js-length");
const lowercaseSetting = document.querySelector(".js-lowercase");
const uppercaseSetting = document.querySelector(".js-uppercase");
const numbersSetting = document.querySelector(".js-numbers");
const symbolsSetting = document.querySelector(".js-symbols");
const generatorButton = document.querySelector(".js-generator-button");
const copyButton = document.querySelector(".js-copy-button");
const output = document.querySelector(".js-output");

function cryptoRandom() {
  const crypto = window.crypto || window.msCrypto;
  const typedArray = new Uint32Array(1);
  const maxNumber = Math.pow(2, 32);
  const randomFloat = crypto.getRandomValues(typedArray)[0] / maxNumber;

  return randomFloat;
}

function generatePassword(
  lengthValue,
  hasLowercase,
  hasUppercase,
  hasNumbers,
  hasSymbols
) {
  const UNICODE_TABLE = {
    lowercase: [97, 122],
    uppercase: [65, 90],
    numbers: [48, 57],
    symbols: [33, 47]
  };
  const settings = [
    { name: "lowercase", state: hasLowercase },
    { name: "uppercase", state: hasUppercase },
    { name: "numbers", state: hasNumbers },
    { name: "symbols", state: hasSymbols }
  ];
  const unicodeIndexes = [];
  const generatedPassword = [];

  for (const setting of settings) {
    const isSettingEnabled = setting.state;
    const minUnicodeIndex = UNICODE_TABLE[setting.name][0];
    const maxUnicodeIndex = UNICODE_TABLE[setting.name][1];

    if (isSettingEnabled) {
      for (let i = minUnicodeIndex; i <= maxUnicodeIndex; i++) {
        unicodeIndexes.push(i);
      }
    }
  }

  for (let i = 1; i <= lengthValue; i++) {
    const randomIndex = Math.floor(cryptoRandom() * unicodeIndexes.length);
    const randomCharacter = String.fromCharCode(unicodeIndexes[randomIndex]);

    generatedPassword.push(randomCharacter);
  }

  output.textContent = generatedPassword.join("");
}

function copyPassword() {
  const textarea = document.createElement("textarea");

  /* Hide textarea from screen readers */

  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-999999px";

  /*************************************/

  textarea.value = output.textContent;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function limitMaxLength() {
  if (+lengthSetting.value > 128) {
    lengthSetting.value = "128";
  }
}

form.addEventListener("submit", event => event.preventDefault());

lengthSetting.addEventListener("keyup", () => limitMaxLength());

generatorButton.addEventListener("click", () => {
  const lengthValue = +lengthSetting.value;
  const hasLowercase = lowercaseSetting.checked;
  const hasUppercase = uppercaseSetting.checked;
  const hasNumbers = numbersSetting.checked;
  const hasSymbols = symbolsSetting.checked;

  if (lengthValue < 5) return;

  generatePassword(
    lengthValue,
    hasLowercase,
    hasUppercase,
    hasNumbers,
    hasSymbols
  );
});

copyButton.addEventListener("click", () => copyPassword());

