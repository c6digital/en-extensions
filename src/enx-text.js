import { getComponentAttributes, getElementsOfComponent } from "./helpers";

export default class ENXText {
  constructor() {
    if (!this.isEnabled()) return;

    this.run();
  }

  run() {
    const elements = getElementsOfComponent("text");

    if (elements.length > 0) {
      elements.forEach((el) => {
        const config = getComponentAttributes(el, "text");
        if (config) {
          config.forEach((attr) => {
            const sourceEl = document.querySelector(`.${attr.source}`);
            if (sourceEl) {
              el.textContent = sourceEl.textContent;
            }
          });
        }
      });
    }
  }

  isEnabled() {
    return ENX.getConfigValue("enxText") !== false;
  }
}
