import { getComponentAttributes, getElementsOfComponent } from "./helpers";

export default class ENXHtml {
  constructor() {
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
}
