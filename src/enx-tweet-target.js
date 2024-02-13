import {
  getComponentAttributes,
  getElementsOfComponent,
  getMPPhotoUrl,
  getNextPageUrl,
  log,
  shuffleArray,
} from "./helpers";

export default class ENXTweetTarget {
  constructor() {
    if (!this.isEnabled()) return;
    if (!this.shouldRun()) return;

    this.currentTweet = 0;
    this.tweetTextarea = document.querySelector(".en__tweet textarea");
    this.tweets = [];

    const tweetTargetEl = [...getElementsOfComponent("tweet-target")].find((el) => {
      return !el.classList.contains("enx-tweet-target:custom-tweets");
    });

    if (!tweetTargetEl) {
      log("No tweet target main element found, not running TweetTarget");
      return;
    }

    const defaultConfig = {
      "custom-tweets": true,
      "mp-photo": true,
      "hide-background-tab": true,
      "hide-sent-btn": true,
      "show-target-profile": true,
      "redirect-on-tweet": true,
    };
    const componentAttrs = getComponentAttributes(tweetTargetEl, "tweet-target");
    const componentConfig = componentAttrs ? componentAttrs[0] : {};
    const config = {
      ...defaultConfig,
      ...componentConfig,
    };

    if (config["custom-tweets"] === true) {
      this.customTweets();
    }

    if (config["mp-photo"] === true) {
      this.setMPPhoto();
    }

    if (config["hide-background-tab"] === true) {
      this.hideBackgroundTab();
    }

    if (config["hide-sent-btn"] === true) {
      this.hideSentBtn();
    }

    if (config["show-target-profile"] !== true) {
      this.hideTargetProfile();
    }

    if (config["redirect-on-tweet"] === true) {
      this.redirectOnTweet();
    }
  }

  redirectOnTweet() {
    const sentBtn = document.querySelector(".en__tweetButton__send > a");

    sentBtn.addEventListener("click", () => {
      // We need to wait for EN to set the "href" attribute on the link and open the popup
      // so we use setTimeout to push the redirect to the end of the event loop
      setTimeout(() => {
        window.location.href = getNextPageUrl();
      }, 0);
    });
  }

  hideTargetProfile() {
    const targetProfile = document.querySelector(".en__twitterTarget");
    targetProfile.style.display = "none";
  }

  hideBackgroundTab() {
    const backgroundToggle = document.querySelector(".en__tweetBackgroundToggle");
    backgroundToggle.style.display = "none";

    const backgroundText = document.querySelector(".en__tweetBackgroundText");
    backgroundText.style.display = "none";
  }

  hideSentBtn() {
    const sentBtn = document.querySelector(".en__tweetButton__sent");
    sentBtn.style.display = "none";
  }

  async setMPPhoto() {
    const mpJson = JSON.parse(document.querySelector(".en__tweetBackgroundText").textContent);
    const img = document.querySelector(".en__twitterTarget__image");
    img.src = await getMPPhotoUrl(mpJson.name, mpJson.location);
  }

  customTweets() {
    if (
      document.querySelectorAll(
        "[class*='enx-tweet-target:custom-tweets'] .en__component--copyblock"
      ).length === 0
    ) {
      log("No custom tweets found, not running customTweets");
      return;
    }

    this.getCustomTweets();
    this.addNewTweetBtn();
  }

  getCustomTweets() {
    const targetTwitterHandle = document.querySelector(".en__twitterTarget__handle").textContent;

    const tweets = [
      ...document.querySelectorAll(
        "[class*='enx-tweet-target:custom-tweets'] .en__component--copyblock, .en__tweet textarea"
      ),
    ].map((tweet) => tweet.textContent.replace("{twitter_handle}", targetTwitterHandle).trim());

    this.tweets = shuffleArray(tweets);
  }

  addNewTweetBtn() {
    document.head.insertAdjacentHTML(
      "beforeend",
      `<style>
        .en__tweet {
          position: relative;
        }

        .en__tweet textarea {
          padding-top: 35px;
        }

        .enx-tweet-target\\:new-tweet-btn {
          background-color: transparent;
          border: none;
          padding: 0;
          position: absolute;
          top: 20px;
          right: 20px;
          width: 24px;
          height: 24px;
          color: rgb(55 65 81);
        }

        .spin {
          animation: spin 0.5s ease-in-out;
        }
        
        .en__tweetButton--sent .en__tweetButton__send {
          display: inline-block;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      </style>
      `
    );

    const tweetArea = document.querySelector(".en__tweet");
    const newTweetBtn = `<button class="enx-tweet-target:new-tweet-btn" type="button"><svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path></svg></button>`;
    tweetArea.insertAdjacentHTML("beforeend", newTweetBtn);

    const newBtnEl = document.querySelector(
      ".en__tweet > [class*='enx-tweet-target:new-tweet-btn']"
    );
    const svg = newBtnEl.querySelector("svg");

    newBtnEl.addEventListener("click", () => {
      svg.classList.add("spin");
      setTimeout(() => {
        svg.classList.remove("spin");
      }, 500);

      if (this.currentTweet >= this.tweets.length) {
        this.currentTweet = 0;
      }
      this.tweetTextarea.value = this.tweets[this.currentTweet];
      this.currentTweet++;
    });
  }

  shouldRun() {
    return !!document.querySelector("[class*='enx-tweet-target']");
  }

  isEnabled() {
    return ENX.getConfigValue("enxTweetTarget") !== false;
  }
}
