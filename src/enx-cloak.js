import { getElementsOfComponent } from "./helpers";

/**
 * Prevents flash of unstyled content (FOUC) by removing the enx-cloak class from all elements.
 *
 * Remove the enx-cloak class from all elements.
 */
export default class ENXCloak {
  constructor() {
    if (!this.isEnabled()) return;

    const elements = getElementsOfComponent("cloak");
    if (elements) {
      elements.forEach((el) => {
        el.classList.remove("enx-cloak");
      });
    }
  }

  isEnabled() {
    return ENX.getConfigValue("enxCloak") !== false;
  }
}
