/**
 * Prevents flash of unstyled content (FOUC) by removing the enx-cloak class from all elements.
 *
 * Remove the enx-cloak class from all elements.
 */
export default class ENXCloak {
  constructor() {
    document.querySelectorAll(".enx-cloak").forEach((element) => {
      element.classList.remove("enx-cloak");
    });
  }
}
