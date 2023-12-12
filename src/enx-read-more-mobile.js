export default class ENXReadMoreMobile {
  constructor() {
    this.readMoreSections = document.querySelectorAll("[class*='enx-read-more-mobile']");

    if (this.readMoreSections.length > 0) {
      this.addReadMoreSections();
    }
  }

  addReadMoreSections() {
    this.readMoreSections.forEach((section) => {
      // Wrap paragraphs that will be hidden on mobile with a div "enx-read-more-content-mobile"
      const paragraphs = section.querySelectorAll("p");
      let paragraphsToShow = /enx-read-more-mobile\[([0-9])]/gi.exec(section.className);
      paragraphsToShow = paragraphsToShow ? parseInt(paragraphsToShow[1]) : 2;
      const paragraphsToWrap = [...paragraphs].slice(paragraphsToShow);
      const wrapper = document.createElement("div");
      wrapper.className = "enx-read-more-content-mobile";
      paragraphsToWrap.forEach((paragraph) => {
        wrapper.appendChild(paragraph);
      });
      section.appendChild(wrapper);

      // Insert "Read more" toggle
      wrapper.insertAdjacentHTML(
        "beforebegin",
        `<a style="text-decoration: none; cursor: pointer;" class="enx-read-more-toggle-mobile">
          Read more
          <svg
            class="rm-icon-normal ml-2"
            width="15"
            height="15"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <svg
            class="rm-icon-expanded ml-2"
            width="15"
            height="15"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </a>`
      );
    });

    // After sections have all been set up, add event listeners to toggle content.
    document.querySelectorAll(".enx-read-more-toggle-mobile").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        toggle
          .closest('[class*="enx-read-more-mobile"]')
          .classList.toggle("enx-read-more-mobile--open");
      });
    });
  }
}
