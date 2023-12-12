import { getMPPhotoUrl } from "./helpers";

export default class ENXEmailTarget {
  constructor() {
    this.addPhotoOfMP();
    this.bindContactData();
  }

  addPhotoOfMP() {
    const imageEls = document.querySelectorAll("img[data-mp-location][data-mp-name]");

    if (imageEls.length === 0) return;

    imageEls.forEach(async (img) => {
      img.src = getMPPhotoUrl(img.dataset.mpName, img.dataset.mpLocation);
    });
  }

  //TODO: Is this necessary? Given that we have enx-text now?
  bindContactData() {
    const dataEls = document.querySelectorAll("[data-contact-bind]");

    if (dataEls.length === 0) return;

    dataEls.forEach((el) => {
      document.querySelectorAll(el.dataset.contactBind).forEach((targetEl) => {
        targetEl.textContent = el.textContent;
      });
    });
  }
}
