import { validateVisibleFields } from "./helpers";

export default class ENXMultiStepForm {
  constructor() {
    this.currentStep = 0;
    this.multistepTabs = [];

    if (this.shouldRun()) {
      this.init();
    }
  }

  init() {
    this.resetTabs();
    this.onUrlHit();
    this.onBackButton();
    this.onClick();
  }

  shouldRun() {
    return !!document.querySelector(".enx-multistep");
  }

  resetTabs() {
    this.currentStep = 0;
    const multistepTabNames = [
      ...document.querySelectorAll(".enx-multistep[class*='enx-multistep-name--']"),
    ].map((tab) =>
      tab.className.match(/enx-multistep-name--[a-z]*/gi)[0].replace("enx-multistep-name--", "")
    );
    this.multistepTabs = [...new Set(multistepTabNames)];
  }

  // Via Direct URL hit
  onUrlHit() {
    //Check if there is a force start
    const urlParams = new URLSearchParams(location.href);
    if (
      document.querySelectorAll(".enx-multistep-force-start").length &&
      !urlParams.has("override-force-multistep")
    ) {
      // Ignore URL and go to designated SPA
      this.changeStep(".enx-multistep-force-start");
      history.pushState(null, "", "#");
      this.log("URL", "Show Landing page");
      return;
    }

    //Check if there is a hash to go to a section
    if (window.location.hash) {
      // Go to section in URL
      const destination = location.hash.replace("#", "");
      if (document.querySelectorAll(".enx-multistep-name--" + destination).length) {
        this.changeStep(".enx-multistep-name--" + destination);
        this.log("URL", 'Show "' + location.hash + '"');
        this.setStep(destination);
      } else {
        const spaElements = document.querySelectorAll(".enx-multistep");
        if ([...spaElements].some((element) => element.className.match(/show:/))) {
          window.location = window.location.href.split("#")[0];
        } else {
          this.changeStep(document.querySelector(".enx-multistep"));
        }
      }
      return;
    }

    // If nothing else, show the first section.
    this.changeStep(document.querySelector(".enx-multistep"));
  }

  onBackButton() {
    window.onpopstate = (event) => {
      if (event.state) {
        // Show the section from State
        this.changeStep(".enx-multistep-name--" + event.state.page);
        this.log("Browser", 'Show "' + event.state.page + '"');
        this.setStep(event.state.page);
      } else {
        const spaElements = document.querySelectorAll(".enx-multistep");
        if ([...spaElements].some((element) => element.className.match(/show:/))) {
          location.reload();
        } else {
          //  Show the Initial SPA
          this.changeStep(".enx-multistep");
          this.log("Browser", "Show Landing page");
          this.setStep(this.multistepTabs[0]);
        }
      }
    };
  }

  onClick() {
    const multistepButtons = document.querySelectorAll("[enx-multistep-destination]");

    multistepButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const destination = event.target.getAttribute("enx-multistep-destination");
        const destinationIndex = this.multistepTabs.indexOf(destination);

        const validate =
          !event.target.hasAttribute("no-validate") && this.currentStep < destinationIndex;

        if (
          this.currentStep === destinationIndex ||
          (validate && destinationIndex > this.currentStep + 1)
        )
          return;

        if (validate && !validateVisibleFields()) {
          window.dispatchEvent(
            new CustomEvent("onEnxMultistepError", {
              detail: this.multistepTabs[this.currentStep].className,
            })
          );
          return;
        }

        /* Hide and Show */
        this.changeStep(".enx-multistep-name--" + destination);
        this.log("App", 'Show "' + destination + '"');
        window.dispatchEvent(
          new CustomEvent("enx-multistep:page-view", {
            detail: [
              {
                destination,
                current: this.multistepTabs[this.currentStep],
              },
            ],
          })
        );
        this.setStep(destination);

        if (destination) {
          this.pushState(destination);
        }
      });
    });
  }

  changeStep(step) {
    this.hideAndShow(this.multistepTabs[this.currentStep], step);
  }

  hideAndShow(hide, show) {
    const currentTab = document.querySelector(`.enx-multistep-name--${hide}`);
    if (currentTab) {
      currentTab.classList.remove("enx-multistep-active");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    const nextTabEl = show instanceof Element ? show : document.querySelector(show);
    if (nextTabEl) {
      nextTabEl.classList.add("enx-multistep-active");
    }
  }

  setStep(destination) {
    this.currentStep = this.multistepTabs.indexOf(destination);
  }

  pushState(name) {
    const state = {
      page: name,
    };
    const url = "#" + name;
    history.pushState(state, "", url);
  }

  log(client, action) {
    console.log(
      "%cSPA",
      "color: #241C15; background-color: #FF3EBF; padding: 4px; font-weight: 400;"
    );
    console.log("Client:\t", client);
    console.log("Action:\t", action);
  }

  moveToFirstFailedSpa() {
    const lastFailedValidation = document.querySelector(".en__field--validationFailed");
    const failSpa = lastFailedValidation && lastFailedValidation.closest(".enx-multistep");
    if (!failSpa) return;
    const tabValidated = Array.from(failSpa.classList).find((s) =>
      s.includes("enx-multistep-name--")
    );
    tabValidated && this.changeStep("." + tabValidated);
  }
}
