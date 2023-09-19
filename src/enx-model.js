/**
 * This class will one-way bind the value of an input to the textContent of an element.
 * e.g. an element with the class name "enx-model:supporter.firstName" will be bound to
 * the value of the input with the name "supporter.firstName".
 */
import { getENFieldValue } from "./helpers";

export default class ENXModel {
  constructor() {
    this.bind();
  }

  bind() {
    const bindNames = [...document.querySelectorAll("[class*='enx-model:']")].map((element) => {
      return element.classList.value.split("enx-model:")[1].split(" ")[0];
    });

    if (bindNames.length === 0) return;

    const uniqueBindNames = [...new Set(bindNames)];

    uniqueBindNames.forEach((bindName) => {
      const inputs = [...document.querySelectorAll(`[name="${bindName}"]`)];

      inputs.forEach((input) => {
        input.addEventListener("change", (event) => {
          const className = CSS.escape(`enx-model:${bindName}`);
          const elements = [...document.querySelectorAll(`.${className}`)];
          const value = getENFieldValue(bindName.split(".")[1]);
          elements.forEach((element) => {
            element.textContent = value;
          });
        });
      });
    });
  }
}
