/**
 * This class will one-way bind the value of an input to the textContent of an element.
 * e.g. an element with the class name "enx-model:supporter.firstName" will be bound to
 * the value of the input with the name "supporter.firstName".
 */
import { getENFieldValue } from "./helpers";

export default class ENXModel {
  constructor() {
    this.bindTargets = [...document.querySelectorAll("[class*='enx-model:']")];
    if (this.shouldRun()) {
      this.run();
    }
  }

  shouldRun() {
    return this.bindTargets.length > 0;
  }

  run() {
    const bindSources = this.bindTargets.map((element) => {
      return element.classList.value.split("enx-model:")[1].split(" ")[0];
    });

    const uniqueBindSources = [...new Set(bindSources)];

    uniqueBindSources.forEach((bindSource) => {
      const inputs = [...document.querySelectorAll(`[name="${bindSource}"]`)];

      inputs.forEach((input) => {
        input.addEventListener("change", () => {
          this.updateTargetsWithSourceValue(bindSource);
        });
        this.updateTargetsWithSourceValue(bindSource);
      });
    });
  }

  updateTargetsWithSourceValue(sourceFieldName) {
    const className = CSS.escape(`enx-model:${sourceFieldName}`);
    const elements = [...document.querySelectorAll(`.${className}`)];
    const value = getENFieldValue(sourceFieldName);
    elements.forEach((element) => {
      element.textContent = value;
    });
  }
}
