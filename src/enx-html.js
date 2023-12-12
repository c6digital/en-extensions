export default class ENXHtml {
  constructor() {
    this.run();
  }

  run() {
    const htmlEls = document.querySelectorAll("[class*='enx-html:']");

    if (htmlEls.length > 0) {
      htmlEls.forEach((el) => {
        const className = el.classList.value.split("enx-html:")[1].split(" ")[0];
        const sourceEl = document.querySelector(`.${className}`);
        if (sourceEl) {
          el.innerHTML = sourceEl.innerHTML;
        }
      });
    }
  }
}
