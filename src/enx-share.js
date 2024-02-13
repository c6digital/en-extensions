import { getEnPageLocale } from "./helpers";

export default class ENXShare {
  constructor() {
    if (!this.isEnabled()) return;

    this.svgUrl = "https://storage.c6-digital.net/en-components/img/share-icons/";
    this.shareLabels = {
      en: "Share on",
      fr: "Partager sur",
      de: "Teilen auf",
      es: "Compartir en",
      it: "Condividi su",
    };
    this.customShareSettings = {
      facebook: {
        url: "https://www.facebook.com/sharer/sharer.php?u=",
        msgSelector: "[class*='enx-share:facebook-link']",
        btnSelector: "[class*='enx-share:facebook-button']",
      },
      twitter: {
        url: "https://twitter.com/intent/tweet?text=",
        msgSelector: "[class*='enx-share:twitter-msg']",
        btnSelector: "[class*='enx-share:twitter-button']",
      },
      whatsapp: {
        url: "https://api.whatsapp.com/send?text=",
        msgSelector: "[class*='enx-share:whatsapp-msg']",
        btnSelector: "[class*='enx-share:whatsapp-button']",
      },
      email: {
        subjectUrl: "mailto:?subject=",
        subjectSelector: "[class*='enx-share:email-subject']",
        bodyUrl: "&body=",
        bodySelector: "[class*='enx-share:email-body']",
        btnSelector: "[class*='enx-share:email-button']",
      },
    };

    this.makeShareButtons();
    this.setupSharePreview();

    if (this.hasNativeShareLink()) {
      this.addNativeShareElement();
    }

    this.updateShareLinks();
  }

  makeShareButtons() {
    const shareButtons = document.querySelectorAll(".en__socialShare");

    if (shareButtons.length > 0) {
      shareButtons.forEach((button) => {
        const social = button.getAttribute("data-enshare");
        button.removeAttribute("style");
        button.classList.add("enx-share-link");
        const shareLabel = this.shareLabels[getEnPageLocale()] || this.shareLabels.en;
        button.innerText = `${shareLabel} ${social.charAt(0).toUpperCase() + social.slice(1)}`;
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
    return !!document.querySelector("[class*='enx-share:native-link']");
  }

  addNativeShareElement() {
    const shareEl = document.querySelector("[class*='enx-share:native-link']");
    const shareTitle = document.querySelector("[class*='enx-share:native-title']");
    const shareDescription = document.querySelector("[class*='enx-share:native-description']");

    if ("navigator" in window && "share" in window.navigator) {
      const shareButtonEl = document.createElement("button");
      shareButtonEl.setAttribute("type", "button");
      shareButtonEl.setAttribute("aria-label", "Share");
      shareButtonEl.classList.add("enx-share:native-button");
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
      copyButtonEl.classList.add("enx-share:native-button");
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

  updateShareLinks() {
    ["facebook", "twitter", "whatsapp", "email"].forEach((social) => {
      const config = this.customShareSettings[social];
      const btn = document.querySelector(config.btnSelector);
      if (btn) {
        if (social === "email") {
          const subject = document.querySelector(config.subjectSelector)?.textContent.trim();
          const body = document.querySelector(config.bodySelector)?.textContent.trim();
          btn.setAttribute(
            "href",
            config.subjectUrl +
              encodeURIComponent(subject) +
              config.bodyUrl +
              encodeURIComponent(body)
          );
        } else {
          const msg = document.querySelector(config.msgSelector)?.textContent.trim();
          btn.setAttribute("href", config.url + encodeURIComponent(msg));
        }
      }
    });
  }

  isEnabled() {
    return ENX.getConfigValue("enxShare") !== false;
  }
}
