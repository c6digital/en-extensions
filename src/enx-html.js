import { getComponentAttributes, getElementsOfComponent } from "./helpers";

export default class ENXHtml {
  constructor() {
    if (!this.isEnabled()) return;

    this.run();
  }

  run() {
    const elements = getElementsOfComponent("html");

    if (elements.length > 0) {
      elements.forEach((el) => {
        const config = getComponentAttributes(el, "html");
        if (config) {
          config.forEach((attr) => {
            const sourceEl = document.querySelector(`.${attr.source}`);
            if (sourceEl) {
              el.innerHTML = sourceEl.innerHTML;
            }
          });
        }
      });
    }
  }

  isEnabled() {
    return ENX.getConfigValue("enxHtml") !== false;
  }
}
