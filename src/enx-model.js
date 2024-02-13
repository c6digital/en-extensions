/**
 * This class will one-way bind the value of an input to the textContent of an element.
 * e.g. an element with the class name "enx-model[source=supporter.firstName]" will be bound to
 * the value of the input with the name "supporter.firstName".
 */
import {
  getComponentAttributes,
  getElementsOfComponent,
  getElementsWithComponentAttribute,
  getENFieldValue,
} from "./helpers";

export default class ENXModel {
  constructor() {
    if (!this.isEnabled()) return;

    this.bindTargets = [...getElementsOfComponent("model")];
    if (this.bindTargets.length > 0) {
      this.run();
    }
  }

  isEnabled() {
    return ENX.getConfigValue("enxModel") !== false;
  }

  run() {
    const bindSources = this.bindTargets.map((el) => {
      const attr = getComponentAttributes(el, "model");
      return attr[0].source;
    });

    const uniqueBindSources = [...new Set(bindSources)];

    uniqueBindSources.forEach((bindSource) => {
      const inputs = [...document.querySelectorAll(`[name="${bindSource}"]`)];

      inputs.forEach((input) => {
        input.addEventListener("input", () => {
          this.updateTargetsWithSourceValue(bindSource);
        });
        this.updateTargetsWithSourceValue(bindSource);
      });
    });
  }

  updateTargetsWithSourceValue(sourceFieldName) {
    const elements = getElementsWithComponentAttribute("model", "source", sourceFieldName);
    elements.forEach((element) => {
      element.textContent = getENFieldValue(sourceFieldName);
    });
  }
}
