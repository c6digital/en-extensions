import {
  getComponentAttribute,
  getElementsOfComponent,
  getElementsWithComponentAttribute,
  getFirstElementWithComponentAttribute,
  validateVisibleFields,
} from "./helpers";

export default class ENXMultiStepForm {
  constructor() {
    if (!this.isEnabled()) return;
    if (!this.shouldRun()) return;

    this.currentStep = 0;
    this.multistepTabs = [];
    this.init();
  }

  init() {
    this.resetTabs();
    this.onUrlHit();
    this.onBackButton();
    this.onClick();
  }

  isEnabled() {
    return ENX.getConfigValue("enxMultiStepForm") !== false;
  }

  shouldRun() {
    return !!document.querySelector("[class*='enx-multistep']");
  }

  resetTabs() {
    this.currentStep = 0;

    this.multistepTabs = [...getElementsOfComponent("multistep")]
      .map((tab) => {
        return getComponentAttribute(tab, "multistep", "name");
      })
      .filter(Boolean);
  }

  // Via Direct URL hit
  onUrlHit() {
    //Check if there is a force start
    const urlParams = new URLSearchParams(window.location.search);
    const forceStartEl = getFirstElementWithComponentAttribute("multistep", "force-start", "true");
    if (forceStartEl && !urlParams.has("enx-multistep-override-force")) {
      this.changeStep(forceStartEl);
      history.pushState(null, "", "#");
      this.log("URL", "Show Landing page");
      return;
    }

    //Check if there is a hash to go to a section
    if (window.location.hash) {
      // Go to section in URL
      const destination = location.hash.replace("#", "");
      const stepFromHash = getFirstElementWithComponentAttribute("multistep", "name", destination);

      if (stepFromHash) {
        this.changeStep(stepFromHash);
        this.log("URL", 'Show "' + location.hash + '"');
        this.setStep(destination);
        return;
      }
    }

    // If nothing else, show the first section.
    this.changeStep(getFirstElementWithComponentAttribute("multistep", "name"));
  }

  onBackButton() {
    window.onpopstate = (event) => {
      if (event.state) {
        // Show the section from State
        this.changeStep(
          getFirstElementWithComponentAttribute("multistep", "name", event.state.page)
        );
        this.log("Browser", 'Show "' + event.state.page + '"');
        this.setStep(event.state.page);
      } else {
        // Show the Initial SPA
        this.changeStep(getFirstElementWithComponentAttribute("multistep", "name"));
        this.log("Browser", "Show Landing page");
        this.setStep(this.multistepTabs[0]);
      }
    };
  }

  onClick() {
    const multistepButtons = getElementsWithComponentAttribute("multistep", "destination");

    multistepButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const destination = getComponentAttribute(button, "multistep", "destination");
        const destinationIndex = this.multistepTabs.indexOf(destination);

        const validate =
          !getComponentAttribute(button, "multistep", "no-validate") &&
          this.currentStep < destinationIndex;

        if (
          this.currentStep === destinationIndex ||
          (validate && destinationIndex > this.currentStep + 1)
        )
          return;

        if (validate && !validateVisibleFields()) {
          window.dispatchEvent(
            new CustomEvent("enx-multistep:error", {
              detail: this.multistepTabs[this.currentStep].className,
            })
          );
          return;
        }

        /* Hide and Show */
        this.changeStep(getFirstElementWithComponentAttribute("multistep", "name", destination));
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
    const currentTab = getFirstElementWithComponentAttribute("multistep", "name", hide);
    if (currentTab) {
      currentTab.classList.remove("enx-multistep:active");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    const nextTabEl = show instanceof Element ? show : document.querySelector(show);
    if (nextTabEl) {
      nextTabEl.classList.add("enx-multistep:active");
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
}
