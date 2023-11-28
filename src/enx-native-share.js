export default class ENXNativeShare {
  constructor() {
    if (this.shouldRun()) {
      this.run();
    }
  }

  shouldRun() {
    return !!document.querySelector(".social-share-native-link");
  }

  run() {
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
