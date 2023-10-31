(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/helpers.js
  var helpers_exports = {};
  __export(helpers_exports, {
    getENFieldValue: () => getENFieldValue,
    getENSupporterData: () => getENSupporterData,
    setENFieldValue: () => setENFieldValue
  });
  function getENFieldValue(field, sessionFallback = true) {
    const fieldValue = window.EngagingNetworks.require._defined.enDefaults.getFieldValue(field);
    if (fieldValue)
      return fieldValue;
    if (sessionFallback)
      return getENSupporterData(field);
  }
  function getENSupporterData(field) {
    return window.EngagingNetworks.require._defined.enDefaults.getSupporterData(field);
  }
  function setENFieldValue(field, value) {
    window.EngagingNetworks.require._defined.enDefaults.setFieldValue(field, value);
  }

  // src/enx-model.js
  var ENXModel = class {
    constructor() {
      this.bind();
    }
    bind() {
      const bindNames = [...document.querySelectorAll("[class*='enx-model:']")].map((element) => {
        return element.classList.value.split("enx-model:")[1].split(" ")[0];
      });
      if (bindNames.length === 0)
        return;
      const uniqueBindNames = [...new Set(bindNames)];
      uniqueBindNames.forEach((bindName) => {
        const inputs = [...document.querySelectorAll(`[name="${bindName}"]`)];
        inputs.forEach((input) => {
          input.addEventListener("change", (event) => {
            const className = CSS.escape(`enx-model:${bindName}`);
            const elements = [...document.querySelectorAll(`.${className}`)];
            const value = getENFieldValue(bindName.split(".")[1]);
            elements.forEach((element) => {
              element.textContent = value;
            });
          });
        });
      });
    }
  };

  // src/enx-proxy-fields.js
  var ENXProxyFields = class {
    constructor(config = []) {
      this.config = config;
      this.activateProxyFields();
    }
    activateProxyFields() {
      this.config.forEach((proxy) => {
        const sourceField = proxy.source.split(".")[1];
        const targetField = proxy.target.split(".")[1];
        document.querySelectorAll(`[name="${proxy.source}"]`).forEach((input) => {
          input.addEventListener("change", () => {
            setENFieldValue(targetField, getENSupporterData(sourceField));
          });
        });
        setENFieldValue(targetField, getENSupporterData(sourceField));
      });
    }
  };

  // src/enx-cloak.js
  var ENXCloak = class {
    constructor() {
      document.querySelectorAll(".enx-cloak").forEach((element) => {
        element.classList.remove("enx-cloak");
      });
    }
  };

  // src/enx-multi-step-form.js
  var ENXMultiStepForm = class {
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
      const spaNames = [...document.querySelectorAll(".spa[class*='spa-name--']")].map(
        (tab) => tab.className.match(/spa-name--[a-z]*/gi)[0].replace("spa-name--", "")
      );
      this.spaTabs = [...new Set(spaNames)];
    }
    // Via Direct URL hit
    onUrlHit() {
      if (window.location.hash) {
        const urlParams = new URLSearchParams(location.href);
        if (document.querySelectorAll(".spa-force-start").length && !urlParams.has("override-force-spa")) {
          this.changeSpa(".spa-force-start");
          history.pushState(null, "", "#");
          this.log("URL", "Show Landing page");
        } else {
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
          this.changeSpa(".spa-name--" + event.state.page);
          this.log("Browser", 'Show "' + event.state.page + '"');
          this.setStep(event.state.page);
        } else {
          const spaElements = document.querySelectorAll(".spa:not(.spa-hidden)");
          if ([...spaElements].some((element) => element.className.match(/show:/))) {
            location.reload();
          } else {
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
          const validate = !event.target.hasAttribute("no-validate") && this.currentStep < destinationIndex;
          if (this.currentStep === destinationIndex || validate && destinationIndex > this.currentStep + 1)
            return;
          if (validate && !this.validateVisibleFields()) {
            window.dispatchEvent(
              new CustomEvent("onSpaError", {
                detail: this.spaTabs[this.currentStep].className
              })
            );
            return;
          }
          this.changeSpa(".spa-name--" + destination);
          this.log("App", 'Show "' + destination + '"');
          window.dispatchEvent(
            new CustomEvent("spa:page-view", {
              detail: [
                {
                  destination,
                  current: this.spaTabs[this.currentStep]
                }
              ]
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
        page: name
      };
      const url = "#" + name;
      history.pushState(state, "", url);
    }
    log(client, action) {
      console.log(
        "%cSPA",
        "color: #241C15; background-color: #FF3EBF; padding: 4px; font-weight: 400;"
      );
      console.log("Client:	", client);
      console.log("Action:	", action);
    }
    moveToFirstFailedSpa() {
      const lastFailedValidation = document.querySelector(".en__field--validationFailed");
      const failSpa = lastFailedValidation && lastFailedValidation.closest(".spa");
      if (!failSpa)
        return;
      const tabValidated = Array.from(failSpa.classList).find((s) => s.includes("spa-name--"));
      tabValidated && this.changeSpa("." + tabValidated);
    }
    validateVisibleFields() {
      return true;
    }
  };

  // src/enx.js
  var ENX = class {
    constructor(config = {}) {
      const defaultConfig = {
        proxies: [],
        beforeInit: () => {
        },
        beforeCloakRemoval: () => {
        },
        afterInit: () => {
        }
      };
      this.config = {
        ...defaultConfig,
        ...config
      };
      this.config.beforeInit();
      this.waitForEnDefaults().then(() => {
        this.model = new ENXModel();
        this.proxyFields = new ENXProxyFields(this.config.proxies);
        this.multiStepForm = new ENXMultiStepForm();
        this.helpers = helpers_exports;
        this.config.beforeCloakRemoval();
        this.cloak = new ENXCloak();
        this.config.afterInit();
      });
    }
    waitForEnDefaults() {
      return new Promise((resolve) => {
        function checkEnDefaults() {
          if (window.EngagingNetworks.require._defined.enDefaults !== void 0) {
            resolve();
          } else {
            setTimeout(checkEnDefaults, 50);
          }
        }
        checkEnDefaults();
      });
    }
  };

  // src/index.js
  window.ENX = ENX;
  var src_default = ENX;
})();
