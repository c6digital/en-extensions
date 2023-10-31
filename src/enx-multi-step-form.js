export default class ENXMultiStepForm {
  constructor() {
    this.currentStep = 0;
    this.spaTabs = [];

    this.init();
  }

  init() {
    this.resetTabs();
    this.onUrlHit();
    this.onBackButton();
    this.onClick();
  }

  resetTabs() {
    this.currentStep = 0;
    const spaNames = [...document.querySelectorAll(".spa[class*='spa-name--']")].map((tab) =>
      tab.className.match(/spa-name--[a-z]*/gi)[0].replace("spa-name--", "")
    );
    this.spaTabs = [...new Set(spaNames)];
  }

  // Via Direct URL hit
  onUrlHit() {
    if (window.location.hash) {
      const urlParams = new URLSearchParams(location.href);
      if (
        document.querySelectorAll(".spa-force-start").length &&
        !urlParams.has("override-force-spa")
      ) {
        // Ignore URL and go to designated SPA
        this.changeSpa(".spa-force-start");
        history.pushState(null, "", "#");
        this.log("URL", "Show Landing page");
      } else {
        // Go to SPA in URL
        const destination = location.hash.replace("#", "");
        if (document.querySelectorAll(".spa-name--" + destination).length) {
          this.changeSpa(".spa-name--" + destination);
          this.log("URL", 'Show "' + location.hash + '"');
          this.setStep(destination);
        } else {
          const spaElements = document.querySelectorAll(".spa:not(.spa-hidden)");
          if ([...spaElements].some((element) => element.className.match(/show:/))) {
            window.location = window.location.href.split("#")[0];
          } else {
            this.changeSpa(document.querySelector(".spa:not(.spa-hidden)"));
          }
        }
      }
    } else {
      this.changeSpa(document.querySelector(".spa:not(.spa-hidden)"));
    }
  }

  onBackButton() {
    window.onpopstate = (event) => {
      if (event.state) {
        // Show the SPA from State
        this.changeSpa(".spa-name--" + event.state.page);
        this.log("Browser", 'Show "' + event.state.page + '"');
        this.setStep(event.state.page);
      } else {
        const spaElements = document.querySelectorAll(".spa:not(.spa-hidden)");
        if ([...spaElements].some((element) => element.className.match(/show:/))) {
          location.reload();
        } else {
          //  Show the Initial SPA
          this.changeSpa(".spa:not(.spa-hidden)");
          this.log("Browser", "Show Landing page");
          this.setStep(this.spaTabs[0]);
        }
      }
    };
  }

  onClick() {
    const spaButtons = document.querySelectorAll("[spa-destination]");

    spaButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const destination = event.target.getAttribute("spa-destination");
        const destinationIndex = this.spaTabs.indexOf(destination);

        const validate =
          !event.target.hasAttribute("no-validate") && this.currentStep < destinationIndex;

        if (
          this.currentStep === destinationIndex ||
          (validate && destinationIndex > this.currentStep + 1)
        )
          return;

        if (validate && !this.validateVisibleFields()) {
          window.dispatchEvent(
            new CustomEvent("onSpaError", {
              detail: this.spaTabs[this.currentStep].className,
            })
          );
          return;
        }

        /* Hide and Show */
        this.changeSpa(".spa-name--" + destination);
        this.log("App", 'Show "' + destination + '"');
        window.dispatchEvent(
          new CustomEvent("spa:page-view", {
            detail: [
              {
                destination,
                current: this.spaTabs[this.currentStep],
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

  changeSpa(spa) {
    this.hideAndShow(this.spaTabs[this.currentStep], spa);
  }

  hideAndShow(hide, show) {
    const currentTab = document.querySelector(`.spa-name--${hide}`);
    if (currentTab) {
      currentTab.classList.remove("spa-active");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    const nextTabEl = show instanceof Element ? show : document.querySelector(show);
    if (nextTabEl) {
      nextTabEl.classList.add("spa-active");
    }
  }

  hideImportant(hide) {
    hide.style.display = "none!important";
  }

  setStep(destination) {
    this.currentStep = this.spaTabs.indexOf(destination);
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
    const failSpa = lastFailedValidation && lastFailedValidation.closest(".spa");
    if (!failSpa) return;
    const tabValidated = Array.from(failSpa.classList).find((s) => s.includes("spa-name--"));
    tabValidated && this.changeSpa("." + tabValidated);
  }

  validateVisibleFields() {
    //TODO: implement validation, either here or as separate module. TBD.
    return true;
  }
}
