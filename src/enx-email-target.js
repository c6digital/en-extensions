import { getMPPhotoUrl } from "./helpers";

export default class ENXEmailTarget {
  constructor() {
    this.addPhotoOfMP();
  }

  addPhotoOfMP() {
    const imageEls = document.querySelectorAll("img[data-mp-location][data-mp-name]");

    if (imageEls.length === 0) return;

    imageEls.forEach(async (img) => {
      img.src = getMPPhotoUrl(img.dataset.mpName, img.dataset.mpLocation);
    });
  }
}
