export default class ENXShare {
  //TODO: Add "customShareSettings" functionality
  constructor() {
    this.svgUrl = "https://storage.c6-digital.net/en-components/img/share-icons/";

    this.makeShareButtons();
    this.setupSharePreview();

    if (this.hasNativeShareLink()) {
      this.addNativeShareElement();
    }
  }

  makeShareButtons() {
    const shareButtons = document.querySelectorAll(".en__socialShare");

    if (shareButtons.length > 0) {
      shareButtons.forEach((button) => {
        const social = button.getAttribute("data-enshare");
        button.removeAttribute("style");
        button.classList.add("enx-share-link");
        button.innerText = "Share on " + social.charAt(0).toUpperCase() + social.slice(1);
        const img = document.createElement("img");
        img.classList.add("enx-share-icon");
        img.setAttribute("src", this.svgUrl + social + ".svg");
        button.appendChild(img);
      });
    }
  }

  setupSharePreview() {
    document
      .querySelector(".share-preview-image")
      ?.setAttribute(
        "src",
        document.querySelector("meta[property='og:image']").getAttribute("content")
      );

    document
      .querySelector(".share-preview-title")
      ?.setAttribute(
        "src",
        document.querySelector("meta[property='og:title']").getAttribute("content")
      );

    document
      .querySelector(".share-preview-description")
      ?.setAttribute(
        "src",
        document.querySelector("meta[property='og:description']").getAttribute("content")
      );

    document
      .querySelector(".share-preview-link")
      ?.setAttribute(
        "href",
        document.querySelector(".en__socialShare--facebook").getAttribute("href")
      );
  }

  hasNativeShareLink() {
    return !!document.querySelector(".social-share-native-link");
  }

  addNativeShareElement() {
    const shareEl = document.querySelector(".social-share-native-link");
    const shareTitle = document.querySelector(".social-share-native-title");
    const shareDescription = document.querySelector(".social-share-native-description");

    if ("navigator" in window && "share" in window.navigator) {
      const shareButtonEl = document.createElement("button");
      shareButtonEl.setAttribute("type", "button");
      shareButtonEl.setAttribute("aria-label", "Share");
      shareButtonEl.classList.add("social-share-native-button");
      shareButtonEl.textContent = "Share";
      shareEl.appendChild(shareButtonEl);

      shareButtonEl.addEventListener("click", () => {
        const shareOptions = {
          url: shareEl.querySelector("p").textContent.trim(),
        };

        if (shareTitle) {
          shareOptions.title = shareTitle.textContent.trim();
        }

        if (shareDescription) {
          shareOptions.text = shareDescription.textContent.trim();
        }

        window.navigator.share(shareOptions);
      });
    } else {
      const copyButtonEl = document.createElement("button");
      copyButtonEl.setAttribute("type", "button");
      copyButtonEl.setAttribute("aria-label", "Copy");
      copyButtonEl.classList.add("social-share-native-button");
      copyButtonEl.textContent = "Copy";
      shareEl.appendChild(copyButtonEl);

      copyButtonEl.addEventListener("click", () => {
        const range = document.createRange();
        range.selectNode(shareEl.querySelector("p"));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand("copy");
        window.getSelection().removeAllRanges();

        copyButtonEl.textContent = "Copied!";
        copyButtonEl.setAttribute("disabled", "disabled");
        setTimeout(() => {
          copyButtonEl.textContent = "Copy";
          copyButtonEl.removeAttribute("disabled");
        }, 2000);
      });
    }
  }
}
