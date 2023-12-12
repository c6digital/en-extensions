export default class ENXText {
  constructor() {
    this.run();
  }

  run() {
    const textEls = document.querySelectorAll("[class*='enx-text:']");

    if (textEls.length > 0) {
      textEls.forEach((el) => {
        const className = el.classList.value.split("enx-text:")[1].split(" ")[0];
        const sourceEl = document.querySelector(`.${className}`);
        if (sourceEl) {
          el.textContent = sourceEl.textContent;
        }
      });
    }
  }
}
