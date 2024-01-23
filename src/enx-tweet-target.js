import { getMPPhotoUrl, getNextPageUrl, shuffleArray } from "./helpers";

export default class ENXTweetTarget {
  constructor() {
    this.currentTweet = 0;
    this.tweetTextarea = document.querySelector(".en__tweet textarea");
    this.tweets = [];

    if (document.querySelector(".ttt--custom-tweets")) {
      this.customTweets();
    }

    if (document.querySelector(".ttt--mp-picture")) {
      this.setMPPhoto();
    }

    if (document.querySelector(".ttt--hide-background-tab")) {
      this.hideBackgroundTab();
    }

    if (document.querySelector(".ttt--hide-sent-btn")) {
      this.hideSentBtn();
    }

    if (document.querySelector(".ttt--hide-target-profile")) {
      this.hideTargetProfile();
    }

    if (document.querySelector(".ttt--redirect-on-tweet")) {
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
    this.getCustomTweets();
    this.addNewTweetBtn();
  }

  getCustomTweets() {
    const targetTwitterHandle = document.querySelector(".en__twitterTarget__handle").textContent;

    const tweets = [
      ...document.querySelectorAll(
        ".ttt--custom-tweets .en__component--copyblock, .en__tweet textarea"
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

        .new-tweet-btn {
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
    const newTweetBtn = `<button class="new-tweet-btn" type="button"><svg class="new-tweet-svg" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path></svg></button>`;
    tweetArea.insertAdjacentHTML("beforeend", newTweetBtn);

    const newBtnEl = document.querySelector(".en__tweet > .new-tweet-btn");
    const svg = document.querySelector(".en__tweet .new-tweet-svg");

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
}
