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
      this.bindTargets = [...document.querySelectorAll("[class*='enx-model:']")];
      if (this.shouldRun()) {
        this.run();
      }
    }
    shouldRun() {
      return this.bindTargets.length > 0;
    }
    run() {
      const bindSources = this.bindTargets.map((element) => {
        return element.classList.value.split("enx-model:")[1].split(" ")[0];
      });
      const uniqueBindSources = [...new Set(bindSources)];
      uniqueBindSources.forEach((bindSource) => {
        const inputs = [...document.querySelectorAll(`[name="${bindSource}"]`)];
        inputs.forEach((input) => {
          input.addEventListener("change", () => {
            const className = CSS.escape(`enx-model:${bindSource}`);
            const elements = [...document.querySelectorAll(`.${className}`)];
            const value = getENFieldValue(bindSource.split(".")[1]);
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
    constructor(proxies = []) {
      this.proxies = proxies;
      if (this.shouldRun()) {
        this.activateProxyFields();
      }
    }
    shouldRun() {
      return this.proxies.length > 0;
    }
    activateProxyFields() {
      this.proxies.forEach((proxy) => {
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

  // src/enx-show.js
  var ENXShow = class {
    constructor() {
      this.init();
      this.legacyFunctionality();
    }
    init() {
      document.querySelectorAll('[class*="enx-show:"]').forEach((conditionalEl) => {
        const conditionalClass = this.getConditionalClassFromElement(conditionalEl);
        const classDetails = this.getMatchDetailsFromClass(conditionalClass);
        if (!classDetails)
          return;
        const inputs = document.getElementsByName(classDetails.fieldName);
        if (inputs.length === 0) {
          conditionalEl.classList.add("enx-hidden");
        }
        inputs.forEach((input) => {
          if (input.type === "radio" || input.type === "checkbox") {
            if (input.value === classDetails.fieldValue && input.checked) {
              conditionalEl.classList.remove("enx-hidden");
            } else {
              conditionalEl.classList.add("enx-hidden");
            }
          } else if (input.value === classDetails.fieldValue) {
            conditionalEl.classList.remove("enx-hidden");
          } else {
            conditionalEl.classList.add("enx-hidden");
          }
        });
      });
      document.querySelector(".en__component--page")?.addEventListener("input", (e) => {
        const target = e.target;
        if (target.matches("input, select, textarea")) {
          this.checkShowHide(target.name, target.value);
        }
      });
    }
    checkShowHide(fieldName, fieldValue) {
      if (!fieldName || !fieldValue)
        return;
      if (fieldName === "transaction.donationAmt.other") {
        fieldName = "transaction.donationAmt";
      }
      const conditionalEls = document.querySelectorAll('[class*="enx-show:"]');
      conditionalEls.forEach((conditionalEl) => {
        const conditionalClass = this.getConditionalClassFromElement(conditionalEl);
        const classDetails = this.getMatchDetailsFromClass(conditionalClass);
        if (!classDetails || classDetails.fieldName !== fieldName)
          return;
        if (classDetails.fieldValue === fieldValue) {
          conditionalEl.classList.remove("enx-hidden");
        } else {
          conditionalEl.classList.add("enx-hidden");
        }
      });
    }
    getConditionalClassFromElement(conditionalEl) {
      return conditionalEl.className.split(" ").find((className) => className.includes("enx-show:"));
    }
    getMatchDetailsFromClass(conditionalClass) {
      const regex = /enx-show:([^[]+)\[([^[]+)]/g;
      const match = regex.exec(conditionalClass);
      if (!match)
        return null;
      return {
        fieldName: match[1],
        fieldValue: match[2]
      };
    }
    //--------------------------------------------------------------------------------
    //Below is legacy functionality for backwards compatibility
    legacyFunctionality() {
      this.triggerPaymentType();
      this.triggerTaxDeductible();
      this.triggerRecurringPayment();
    }
    showElements(selector) {
      document.querySelectorAll(selector).forEach((element) => {
        element.classList.remove("enx-hidden");
      });
    }
    hideElements(selector) {
      document.querySelectorAll(selector).forEach((element) => {
        element.classList.add("enx-hidden");
      });
    }
    showRecurringPayment() {
      this.hideElements('[class*="show:recurring--"]');
      if (window.hasOwnProperty("isRegularDonorFlag") && typeof window.isRegularDonorFlag !== "undefined") {
        this.showElements(".show\\:recurring--monthly");
        return;
      }
      const val = getENSupporterData("recurrpay");
      if (val === "Y") {
        this.showElements(".show\\:recurring--monthly");
        return;
      } else if (val === "N") {
        this.showElements(".show\\:recurring--single");
      }
      this.showElements(".show\\:recurring--monthly-false");
    }
    triggerRecurringPayment() {
      this.showRecurringPayment();
      const recurringPaymentRadios = document.querySelectorAll(
        'input[type=radio][name="transaction.recurrpay"]'
      );
      recurringPaymentRadios.forEach((element) => {
        element.addEventListener("change", () => {
          this.showRecurringPayment();
        });
      });
    }
    showTaxDeductible() {
      this.hideElements("[class*='show:giftaid--']");
      const val = getENSupporterData("taxdeductible");
      if (val === "Y") {
        this.showElements(".show\\:giftaid--Y");
      } else if (val === "N") {
        this.showElements(".show\\:giftaid--N");
      }
    }
    triggerTaxDeductible() {
      document.querySelectorAll("input[name='transaction.taxdeductible']").forEach((el) => {
        el.addEventListener("change", () => {
          this.showTaxDeductible();
        });
      });
      setTimeout(() => {
        this.showTaxDeductible();
      }, 500);
    }
    showPaymentType() {
      this.hideElements("[class*='show:payment--']");
      const val = getENSupporterData("paymenttype");
      switch (val) {
        case "card":
          this.showElements(".show\\:payment--card");
          break;
        case "paypal":
          this.showElements(".show\\:payment--paypal");
          break;
        case "bacs_debit":
        case "cash":
          this.showElements(".show\\:payment--directdebit");
          break;
        default:
          return;
      }
    }
    triggerPaymentType() {
      document.querySelectorAll(".en__field--paymenttype").forEach((el) => {
        ["DOMNodeInserted", "change"].forEach((event) => {
          el.addEventListener(event, () => {
            const invokePaymentChange = () => {
              setTimeout(() => {
                this.showPaymentType();
              }, 500);
            };
            invokePaymentChange();
            const paymentTypeRadios2 = document.querySelectorAll(
              'input[type=radio][name="transaction.paymenttype"]'
            );
            paymentTypeRadios2.forEach(function(element) {
              element.addEventListener("change", invokePaymentChange);
            });
          });
        });
      });
      const paymentTypeRadios = document.querySelectorAll(
        'input[type=radio][name="transaction.paymenttype"]'
      );
      paymentTypeRadios.forEach((element) => {
        element.addEventListener("change", () => {
          this.showPaymentType();
        });
      });
      setTimeout(() => {
        this.showPaymentType();
      }, 500);
    }
  };

  // src/enx-native-share.js
  var ENXNativeShare = class {
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
            url: shareEl.querySelector("p").textContent.trim()
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
          }, 2e3);
        });
      }
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
      if (window.hasOwnProperty("ENXPageConfig")) {
        this.config = {
          ...this.config,
          ...window.ENXPageConfig
        };
      }
      window.ENXConfig = this.config;
      this.config.beforeInit();
      this.waitForEnDefaults().then(() => {
        this.helpers = helpers_exports;
        this.model = new ENXModel();
        this.proxyFields = new ENXProxyFields(this.config.proxies);
        this.multiStepForm = new ENXMultiStepForm();
        this.show = new ENXShow();
        this.nativeShare = new ENXNativeShare();
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
