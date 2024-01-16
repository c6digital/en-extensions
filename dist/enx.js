(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/helpers.js
  var helpers_exports = {};
  __export(helpers_exports, {
    addMaxLength: () => addMaxLength,
    disableSubmitButton: () => disableSubmitButton,
    displayDonationAmt: () => displayDonationAmt,
    enableSubmitButton: () => enableSubmitButton,
    getCurrency: () => getCurrency,
    getCurrencySymbol: () => getCurrencySymbol,
    getDataFromStorage: () => getDataFromStorage,
    getENFieldValue: () => getENFieldValue,
    getENSupporterData: () => getENSupporterData,
    getENValidators: () => getENValidators,
    getEnPageLocale: () => getEnPageLocale,
    getMPData: () => getMPData,
    getMPPhotoUrl: () => getMPPhotoUrl,
    getNextPageUrl: () => getNextPageUrl,
    getVisibleValidators: () => getVisibleValidators,
    giftAidCalculation: () => giftAidCalculation,
    log: () => log,
    saveDataToStorage: () => saveDataToStorage,
    saveDonationAmtToStorage: () => saveDonationAmtToStorage,
    saveFieldValueToSessionStorage: () => saveFieldValueToSessionStorage,
    setENFieldValue: () => setENFieldValue,
    shuffleArray: () => shuffleArray,
    updateCurrentYear: () => updateCurrentYear,
    updateNextPageUrl: () => updateNextPageUrl,
    validateVisibleFields: () => validateVisibleFields
  });
  function getENFieldValue(field, sessionFallback = true) {
    const fieldValue = window.EngagingNetworks.require._defined.enDefaults.getFieldValue(field);
    if (fieldValue)
      return fieldValue;
    if (sessionFallback)
      return getENSupporterData(field);
    return null;
  }
  function getENSupporterData(field) {
    return window.EngagingNetworks.require._defined.enDefaults.getSupporterData(field);
  }
  function setENFieldValue(field, value) {
    window.EngagingNetworks.require._defined.enDefaults.setFieldValue(field, value);
  }
  function getENValidators() {
    return window.EngagingNetworks.require._defined.enValidation.validation.validators;
  }
  function getVisibleValidators() {
    return getENValidators().filter((x2) => {
      return !!document.querySelector(".enx-multistep-active .en__field--" + x2.field);
    });
  }
  function validateVisibleFields() {
    const validationResults = getVisibleValidators().map((validator) => {
      validator.hideMessage();
      return !validator.isVisible() || validator.test();
    });
    return validationResults.every((result) => result);
  }
  function shuffleArray(array) {
    var m2 = array.length, t2, i2;
    while (m2) {
      i2 = Math.floor(Math.random() * m2--);
      t2 = array[m2];
      array[m2] = array[i2];
      array[i2] = t2;
    }
    return array;
  }
  function getNextPageUrl() {
    return document.querySelector("form.en__component--page")?.getAttribute("action") ?? "";
  }
  async function getMPData(name, location2) {
    try {
      const data = await fetch(
        `https://members-api.parliament.uk/api/Members/Search?skip=0&take=1&Name=${name}&Location=${location2}`
      );
      return await data.json();
    } catch (err) {
      return false;
    }
  }
  async function getMPPhotoUrl(name, location2) {
    const MP = await getMPData(name, location2);
    if (!MP.items[0]) {
      console.log("No MP found for", name, location2);
      return "";
    }
    return MP.items[0].value.thumbnailUrl;
  }
  function getEnPageLocale() {
    return window.pageJson.locale.substring(0, 2) || "en";
  }
  function getCurrency() {
    return getENFieldValue("paycurrency") || getENFieldValue("currency") || "USD";
  }
  function getCurrencySymbol() {
    return 1 .toLocaleString(getEnPageLocale(), {
      style: "currency",
      currency: getCurrency()
    }).replace("1.00", "");
  }
  function saveFieldValueToSessionStorage(field, key = null) {
    if (!key)
      key = field;
    sessionStorage.setItem(key, getENFieldValue(field));
  }
  function saveDonationAmtToStorage() {
    saveFieldValueToSessionStorage("donationAmt");
  }
  function displayDonationAmt() {
    const donationAmtDisplay = document.querySelector(".display-donation-amt");
    const donationAmt = sessionStorage.getItem("donationAmt");
    if (donationAmtDisplay && donationAmt) {
      donationAmtDisplay.textContent = donationAmt;
    }
  }
  function giftAidCalculation() {
    const giftAidCalculation2 = document.querySelector(".gift-aid-calculation");
    const donationAmt = sessionStorage.getItem("donationAmt");
    if (giftAidCalculation2 && donationAmt) {
      let giftAidAmt = donationAmt / 4 * 5;
      if (giftAidAmt % 1 !== 0) {
        giftAidAmt = giftAidAmt.toFixed(2);
      }
      giftAidCalculation2.querySelector(".donation-amt").textContent = donationAmt;
      giftAidCalculation2.querySelector(".gift-aid-amt").textContent = giftAidAmt.toString();
      giftAidCalculation2.style.display = "block";
    }
  }
  function log(message) {
    if (window.ENXConfig.debug) {
      console.log(
        `%c[ENX]: ${message}`,
        "color: #241C15; background-color: #FF3EBF; padding: 4px; font-weight: 400;"
      );
    }
  }
  function updateNextPageUrl() {
    const nextButton = document.querySelector(".next-button");
    nextButton?.setAttribute("href", getNextPageUrl());
  }
  function saveDataToStorage(storageMap = []) {
    storageMap.forEach((element) => {
      const input = document.querySelector(element.storageValue);
      if (input && input.value) {
        sessionStorage.setItem(element.storageKey, input.value);
      }
    });
  }
  function getDataFromStorage(storageMap = []) {
    storageMap.forEach(function(element) {
      const target = document.querySelector(element.target);
      if (target) {
        target.innerText = sessionStorage.getItem(element.key);
      }
    });
  }
  function updateCurrentYear() {
    document.querySelectorAll(".current-year").forEach((el) => {
      el.innerText = (/* @__PURE__ */ new Date()).getFullYear();
    });
  }
  function addMaxLength(fields) {
    fields.forEach((field) => {
      document.querySelector(field.key)?.setAttribute("maxlength", field.maxlength);
    });
  }
  function disableSubmitButton(spinner = true) {
    const submitButtons = document.querySelectorAll(".en__submit button");
    submitButtons.forEach((button) => {
      button.disabled = true;
      if (spinner) {
        button.innerHTML = `<span class="submit-spinner spinner-border"></span> ${button.innerHTML}`;
      }
    });
  }
  function enableSubmitButton() {
    const submitButtons = document.querySelectorAll(".en__submit button");
    submitButtons.forEach((button) => {
      button.disabled = false;
      button.querySelector(".submit-spinner")?.remove();
    });
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
        ...document.querySelectorAll(".enx-multistep[class*='enx-multistep-name--']")
      ].map(
        (tab) => tab.className.match(/enx-multistep-name--[a-z]*/gi)[0].replace("enx-multistep-name--", "")
      );
      this.multistepTabs = [...new Set(multistepTabNames)];
    }
    // Via Direct URL hit
    onUrlHit() {
      const urlParams = new URLSearchParams(location.href);
      if (document.querySelectorAll(".enx-multistep-force-start").length && !urlParams.has("override-force-multistep")) {
        this.changeStep(".enx-multistep-force-start");
        history.pushState(null, "", "#");
        this.log("URL", "Show Landing page");
        return;
      }
      if (window.location.hash) {
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
      this.changeStep(document.querySelector(".enx-multistep"));
    }
    onBackButton() {
      window.onpopstate = (event) => {
        if (event.state) {
          this.changeStep(".enx-multistep-name--" + event.state.page);
          this.log("Browser", 'Show "' + event.state.page + '"');
          this.setStep(event.state.page);
        } else {
          const spaElements = document.querySelectorAll(".enx-multistep");
          if ([...spaElements].some((element) => element.className.match(/show:/))) {
            location.reload();
          } else {
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
          const validate = !event.target.hasAttribute("no-validate") && this.currentStep < destinationIndex;
          if (this.currentStep === destinationIndex || validate && destinationIndex > this.currentStep + 1)
            return;
          if (validate && !validateVisibleFields()) {
            window.dispatchEvent(
              new CustomEvent("onEnxMultistepError", {
                detail: this.multistepTabs[this.currentStep].className
              })
            );
            return;
          }
          this.changeStep(".enx-multistep-name--" + destination);
          this.log("App", 'Show "' + destination + '"');
          window.dispatchEvent(
            new CustomEvent("enx-multistep:page-view", {
              detail: [
                {
                  destination,
                  current: this.multistepTabs[this.currentStep]
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
      const failSpa = lastFailedValidation && lastFailedValidation.closest(".enx-multistep");
      if (!failSpa)
        return;
      const tabValidated = Array.from(failSpa.classList).find(
        (s2) => s2.includes("enx-multistep-name--")
      );
      tabValidated && this.changeStep("." + tabValidated);
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
      document.querySelector(".en__component--page")?.addEventListener("input", (e2) => {
        const target = e2.target;
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

  // src/enx-share.js
  var ENXShare = class {
    //TODO: Add "customShareSettings" functionality
    constructor() {
      this.svgUrl = "https://storage.c6-digital.net/en-components/img/share-icons/";
      this.shareLabels = {
        en: "Share on",
        fr: "Partager sur",
        de: "Teilen auf",
        es: "Compartir en",
        it: "Condividi su"
      };
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
      document.querySelector(".share-preview-image")?.setAttribute(
        "src",
        document.querySelector("meta[property='og:image']").getAttribute("content")
      );
      document.querySelector(".share-preview-title")?.setAttribute(
        "src",
        document.querySelector("meta[property='og:title']").getAttribute("content")
      );
      document.querySelector(".share-preview-description")?.setAttribute(
        "src",
        document.querySelector("meta[property='og:description']").getAttribute("content")
      );
      document.querySelector(".share-preview-link")?.setAttribute(
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

  // src/enx-read-more-mobile.js
  var ENXReadMoreMobile = class {
    constructor() {
      this.readMoreSections = document.querySelectorAll("[class*='enx-read-more-mobile']");
      if (this.readMoreSections.length > 0) {
        this.addReadMoreSections();
      }
    }
    addReadMoreSections() {
      this.readMoreSections.forEach((section) => {
        let numberElsToWrap = /enx-read-more-mobile\[([0-9])]/gi.exec(section.className);
        numberElsToWrap = numberElsToWrap ? parseInt(numberElsToWrap[1]) : 2;
        const els = [...section.children].slice(numberElsToWrap);
        const wrapper = document.createElement("div");
        wrapper.className = "enx-read-more-content-mobile";
        els.forEach((element) => {
          wrapper.appendChild(element);
        });
        section.appendChild(wrapper);
        wrapper.insertAdjacentHTML(
          "beforebegin",
          `<a style="text-decoration: none; cursor: pointer;" class="enx-read-more-toggle-mobile">
          Read more
          <svg
            class="rm-icon-normal ml-2"
            width="15"
            height="15"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <svg
            class="rm-icon-expanded ml-2"
            width="15"
            height="15"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </a>`
        );
      });
      document.querySelectorAll(".enx-read-more-toggle-mobile").forEach((toggle) => {
        toggle.addEventListener("click", () => {
          toggle.closest('[class*="enx-read-more-mobile"]').classList.toggle("enx-read-more-mobile--open");
        });
      });
    }
  };

  // src/enx-text.js
  var ENXText = class {
    constructor() {
      this.run();
    }
    run() {
      const textEls = document.querySelectorAll("[class*='enx-text:']");
      if (textEls.length > 0) {
        textEls.forEach((el) => {
          const className = el.classList.value.split("enx-text:")[1].split(" ")[0];
          const sourceEl = document.querySelector(`.${className}`);
          if (sourceEl) {
            el.textContent = sourceEl.textContent;
          }
        });
      }
    }
  };

  // src/enx-html.js
  var ENXHtml = class {
    constructor() {
      this.run();
    }
    run() {
      const htmlEls = document.querySelectorAll("[class*='enx-html:']");
      if (htmlEls.length > 0) {
        htmlEls.forEach((el) => {
          const className = el.classList.value.split("enx-html:")[1].split(" ")[0];
          const sourceEl = document.querySelector(`.${className}`);
          if (sourceEl) {
            el.innerHTML = sourceEl.innerHTML;
          }
        });
      }
    }
  };

  // src/enx-email-target.js
  var ENXEmailTarget = class {
    constructor() {
      this.addPhotoOfMP();
    }
    addPhotoOfMP() {
      const imageEls = document.querySelectorAll("img[data-mp-location][data-mp-name]");
      if (imageEls.length === 0)
        return;
      imageEls.forEach(async (img) => {
        img.src = getMPPhotoUrl(img.dataset.mpName, img.dataset.mpLocation);
      });
    }
  };

  // src/enx-tweet-target.js
  var ENXTweetTarget = class {
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
    setMPPhoto() {
      const mpJson = JSON.parse(document.querySelector(".en__tweetBackgroundText").textContent);
      const img = document.querySelector(".en__twitterTarget__image");
      img.src = getMPPhotoUrl(mpJson.name, mpJson.location);
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
        )
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
  };

  // src/enx-donate.js
  var ENXDonate = class {
    constructor() {
      this.removeEmptyDecimalFromTotalAmountSpans();
      this.addCurrencyToDonationOther();
    }
    removeEmptyDecimalFromTotalAmountSpans() {
      const amountTotalSpan = document.querySelector('span[data-token="amount-total"]');
      if (!amountTotalSpan)
        return;
      const updateAmountTotalSpans = () => {
        let decSeparator = ".";
        if (window.pageJson && window.pageJson.locale) {
          decSeparator = 1.1.toLocaleString(getEnPageLocale()).substring(1, 2);
        }
        document.querySelectorAll('span[data-token="amount-total"]').forEach((amountTotalSpan2) => {
          amountTotalSpan2.textContent = amountTotalSpan2.textContent.replace(decSeparator + "00", "");
        });
      };
      updateAmountTotalSpans();
      const observer = new MutationObserver(updateAmountTotalSpans);
      observer.observe(amountTotalSpan, { subtree: true, childList: true });
    }
    addCurrencyToDonationOther() {
      document.querySelector(".en__field--donationAmt .en__field__item--other")?.classList.add("amount-currency--" + getCurrency());
    }
  };

  // node_modules/cleave-zen/dist/cleave-zen.module.js
  var e;
  var r;
  var t;
  var i = function(e2) {
    return e2.replace(/[^\d]/g, "");
  };
  var n = function(e2) {
    return e2.reduce(function(e3, r2) {
      return e3 + r2;
    }, 0);
  };
  var a = function(e2, r2) {
    return e2.slice(0, r2);
  };
  var l = function(e2) {
    var r2 = e2.value;
    return e2.delimiters.forEach(function(e3) {
      e3.split("").forEach(function(e4) {
        r2 = r2.replace(new RegExp(e4.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), "g"), "");
      });
    }), r2;
  };
  var u = function(e2) {
    var r2 = e2.blocks, t2 = e2.delimiter, i2 = void 0 === t2 ? "" : t2, n2 = e2.delimiters, a2 = void 0 === n2 ? [] : n2, l2 = e2.delimiterLazyShow, u2 = void 0 !== l2 && l2, c2 = "", s2 = e2.value, o = "";
    return r2.forEach(function(e3, t3) {
      if (s2.length > 0) {
        var n3, l3 = s2.slice(0, e3), d2 = s2.slice(e3);
        o = a2.length > 0 ? null != (n3 = a2[u2 ? t3 - 1 : t3]) ? n3 : o : i2, u2 ? (t3 > 0 && (c2 += o), c2 += l3) : (c2 += l3, l3.length === e3 && t3 < r2.length - 1 && (c2 += o)), s2 = d2;
      }
    }), c2;
  };
  var c = function(e2) {
    var r2 = e2.delimiter, t2 = e2.delimiters, i2 = e2.prefix, n2 = void 0 === i2 ? "" : i2, a2 = e2.input;
    if (void 0 !== a2.CLEAVE_ZEN_cursor_tracker)
      return function() {
        a2.removeEventListener("input", a2.CLEAVE_ZEN_cursor_tracker), a2.CLEAVE_ZEN_cursor_tracker = void 0;
      };
    var u2 = [void 0 === r2 ? "" : r2].concat(void 0 === t2 ? [] : t2);
    return a2.CLEAVE_ZEN_cursor_tracker = function(e3) {
      var r3, t3 = e3.target;
      ("deleteContentBackward" === e3.inputType || t3.value.length !== t3.selectionEnd) && (t3.CLEAVE_ZEN_cleanCursorIndex = function(e4) {
        for (var r4 = e4.value, t4 = e4.dirtyCursorIndex, i3 = e4.delimiters, n3 = t4, a3 = 0; a3 < t4; a3++)
          i3.includes(r4[a3]) && n3--;
        return n3;
      }({ value: t3.value, dirtyCursorIndex: null != (r3 = t3.selectionEnd) ? r3 : 0, delimiters: u2 }), setTimeout(function() {
        var e4;
        if (l({ value: t3.value, delimiters: u2 }) !== n2) {
          var r4 = function(e5) {
            for (var r5 = e5.value, t4 = e5.delimiters, i3 = e5.cleanCursorIndex, n3 = 0; n3 < r5.length && (t4.includes(r5[n3]) && i3++, n3 !== i3 - 1); n3++)
              ;
            return i3;
          }({ value: t3.value, cleanCursorIndex: null != (e4 = t3.CLEAVE_ZEN_cleanCursorIndex) ? e4 : 0, delimiters: u2 });
          t3.setSelectionRange(r4, r4);
        }
      }, 0));
    }, a2.addEventListener("input", a2.CLEAVE_ZEN_cursor_tracker), function() {
      a2.removeEventListener("input", a2.CLEAVE_ZEN_cursor_tracker), a2.CLEAVE_ZEN_cursor_tracker = void 0;
    };
  };
  var s = function(e2, r2) {
    var t2 = r2.blocks, n2 = r2.delimiter, a2 = void 0 === n2 ? "" : n2, c2 = r2.delimiters, s2 = void 0 === c2 ? [] : c2, o = r2.delimiterLazyShow, d2 = void 0 !== o && o, v2 = r2.prefix, m2 = void 0 === v2 ? "" : v2, f2 = r2.numericOnly, p2 = void 0 !== f2 && f2, h2 = r2.uppercase, E2 = void 0 !== h2 && h2, g = r2.lowercase, I = void 0 !== g && g;
    return a2.length > 0 && s2.push(a2), e2 = function(e3) {
      var r3 = e3.value, t3 = e3.prefix, i2 = e3.tailPrefix, n3 = t3.length;
      return 0 === n3 ? r3 : r3 === t3 && "" !== r3 ? "" : r3.slice(0, n3) === t3 || i2 ? r3.slice(-n3) !== t3 && i2 ? "" : i2 ? r3.slice(0, -n3) : r3.slice(n3) : "";
    }({ value: e2 = l({ value: e2, delimiters: s2 }), prefix: m2, tailPrefix: false }), e2 = p2 ? i(e2) : e2, e2 = E2 ? e2.toUpperCase() : e2, e2 = I ? e2.toLowerCase() : e2, m2.length > 0 && (e2 = m2 + e2), u({ value: e2, blocks: t2, delimiter: a2, delimiters: s2, delimiterLazyShow: d2 });
  };
  var d = " ";
  !function(e2) {
    e2.UATP = "uatp", e2.AMEX = "amex", e2.DINERS = "diners", e2.DISCOVER = "discover", e2.MASTERCARD = "mastercard", e2.DANKORT = "dankort", e2.INSTAPAYMENT = "instapayment", e2.JCB15 = "jcb15", e2.JCB = "jcb", e2.MAESTRO = "maestro", e2.VISA = "visa", e2.MIR = "mir", e2.UNIONPAY = "unionpay", e2.GENERAL = "general";
  }(t || (t = {}));
  var v;
  var m = ((e = {})[t.UATP] = [4, 5, 6], e[t.AMEX] = [4, 6, 5], e[t.DINERS] = [4, 6, 4], e[t.DISCOVER] = [4, 4, 4, 4], e[t.MASTERCARD] = [4, 4, 4, 4], e[t.DANKORT] = [4, 4, 4, 4], e[t.INSTAPAYMENT] = [4, 4, 4, 4], e[t.JCB15] = [4, 6, 5], e[t.JCB] = [4, 4, 4, 4], e[t.MAESTRO] = [4, 4, 4, 4], e[t.VISA] = [4, 4, 4, 4], e[t.MIR] = [4, 4, 4, 4], e[t.UNIONPAY] = [4, 4, 4, 4], e[t.GENERAL] = [4, 4, 4, 4], e);
  var f = ((r = {})[t.UATP] = /^(?!1800)1\d{0,14}/, r[t.AMEX] = /^3[47]\d{0,13}/, r[t.DISCOVER] = /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/, r[t.DINERS] = /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/, r[t.MASTERCARD] = /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/, r[t.DANKORT] = /^(5019|4175|4571)\d{0,12}/, r[t.INSTAPAYMENT] = /^63[7-9]\d{0,13}/, r[t.JCB15] = /^(?:2131|1800)\d{0,11}/, r[t.JCB] = /^(?:35\d{0,2})\d{0,12}/, r[t.MAESTRO] = /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/, r[t.MIR] = /^220[0-4]\d{0,12}/, r[t.VISA] = /^4\d{0,15}/, r[t.UNIONPAY] = /^(62|81)\d{0,14}/, r);
  var p = function(e2) {
    var r2 = e2.reduce(function(e3, r3) {
      return e3 + r3;
    }, 0);
    return e2.concat(19 - r2);
  };
  var h = function(e2) {
    for (var r2 = e2.value, i2 = e2.strictMode, n2 = 0, a2 = Object.keys(f); n2 < a2.length; n2++) {
      var l2 = a2[n2];
      if (f[l2].test(r2)) {
        var u2 = m[l2];
        return { type: l2, blocks: null != i2 && i2 ? p(u2) : u2 };
      }
    }
    return { type: t.GENERAL, blocks: null != i2 && i2 ? p(m.general) : m.general };
  };
  var E = function(e2, r2) {
    var t2 = null != r2 ? r2 : {}, c2 = t2.delimiter, s2 = void 0 === c2 ? " " : c2, o = t2.delimiterLazyShow, d2 = void 0 !== o && o, v2 = t2.strictMode, m2 = void 0 !== v2 && v2;
    e2 = i(e2), e2 = l({ value: e2, delimiters: [s2] });
    var f2 = h({ value: e2, strictMode: m2 }).blocks, p2 = n(f2);
    return e2 = a(e2, p2), u({ value: e2, blocks: f2, delimiter: s2, delimiterLazyShow: d2 });
  };
  !function(e2) {
    e2.THOUSAND = "thousand", e2.LAKH = "lakh", e2.WAN = "wan", e2.NONE = "none";
  }(v || (v = {}));
  var x = v.THOUSAND;
  var M = function(e2, r2) {
    var t2 = null != r2 ? r2 : {}, i2 = t2.delimiter, n2 = t2.numeralThousandsGroupStyle, a2 = t2.numeralIntegerScale, l2 = t2.numeralDecimalMark, u2 = t2.numeralDecimalScale, c2 = t2.stripLeadingZeroes, s2 = t2.numeralPositiveOnly, o = t2.tailPrefix, d2 = t2.signBeforePrefix, m2 = t2.prefix;
    return function(e3) {
      var r3, t3, i3, n3 = e3.delimiter, a3 = e3.numeralDecimalMark, l3 = e3.numeralDecimalScale, u3 = e3.stripLeadingZeroes, c3 = e3.numeralPositiveOnly, s3 = e3.numeralIntegerScale, o2 = e3.numeralThousandsGroupStyle, d3 = e3.signBeforePrefix, m3 = e3.tailPrefix, f2 = e3.prefix, p2 = "", h2 = e3.value.replace(/[A-Za-z]/g, "").replace(a3, "M").replace(/[^\dM-]/g, "").replace(/^-/, "N").replace(/-/g, "").replace("N", null != c3 && c3 ? "" : "-").replace("M", a3);
      u3 && (h2 = h2.replace(/^(-)?0+(?=\d)/, "$1"));
      var E2 = "-" === h2.slice(0, 1) ? "-" : "";
      switch (t3 = d3 ? E2 + f2 : f2 + E2, i3 = h2, h2.includes(a3) && (i3 = (r3 = h2.split(a3))[0], p2 = a3 + r3[1].slice(0, l3)), "-" === E2 && (i3 = i3.slice(1)), s3 > 0 && (i3 = i3.slice(0, s3)), o2) {
        case v.LAKH:
          i3 = i3.replace(/(\d)(?=(\d\d)+\d$)/g, "$1" + n3);
          break;
        case v.WAN:
          i3 = i3.replace(/(\d)(?=(\d{4})+$)/g, "$1" + n3);
          break;
        case v.THOUSAND:
          i3 = i3.replace(/(\d)(?=(\d{3})+$)/g, "$1" + n3);
      }
      return m3 ? E2 + i3 + (l3 > 0 ? p2 : "") + f2 : t3 + i3 + (l3 > 0 ? p2 : "");
    }({ value: e2, delimiter: void 0 === i2 ? "," : i2, numeralIntegerScale: void 0 === a2 ? 0 : a2, numeralDecimalMark: void 0 === l2 ? "." : l2, numeralDecimalScale: void 0 === u2 ? 2 : u2, stripLeadingZeroes: void 0 === c2 || c2, numeralPositiveOnly: void 0 !== s2 && s2, numeralThousandsGroupStyle: void 0 === n2 ? x : n2, tailPrefix: void 0 !== o && o, signBeforePrefix: void 0 !== d2 && d2, prefix: void 0 === m2 ? "" : m2 });
  };

  // src/enx-live-validation.js
  var ENXLiveValidation = class {
    constructor(config) {
      this.config = config;
      if (this.shouldRun()) {
        this.email();
        this.creditCard();
        this.cvv();
        this.sortCode(this.config.sortCodeField);
        this.accountNumber(this.config.accountNumberField);
        this.amountOther();
        this.noSpaces(".validate-no-spaces");
        if (this.config.removeErrorsOnInput) {
          this.removeErrorsOnInput();
        }
      }
    }
    shouldRun() {
      return this.config.enabled;
    }
    email(field = "#en__field_supporter_emailAddress") {
      this.noSpaces(field);
    }
    creditCard(field = "#en__field_transaction_ccnumber") {
      const creditCardInput = document.querySelector(field);
      if (creditCardInput) {
        c({
          input: creditCardInput,
          delimiter: d
        });
        creditCardInput.addEventListener("input", (e2) => {
          const value = e2.target.value;
          creditCardInput.value = E(value);
          log(`Credit Card: ${value}, formatted to: ${creditCardInput.value}`);
        });
      }
    }
    cvv(field = "#en__field_transaction_ccvv") {
      const cvvInput = document.querySelector(field);
      cvvInput?.addEventListener("input", (e2) => {
        const value = e2.target.value;
        cvvInput.value = s(value, {
          numericOnly: true,
          blocks: [4]
        });
        log(`CVV: ${value}, formatted to: ${cvvInput.value}`);
      });
    }
    sortCode(field) {
      const sortCodeField = document.getElementsByName(field)[0];
      if (sortCodeField) {
        c({
          input: sortCodeField,
          delimiter: "-"
        });
        sortCodeField.addEventListener("input", (e2) => {
          const value = e2.target.value;
          sortCodeField.value = s(value, {
            delimiter: "-",
            blocks: [2, 2, 2],
            numericOnly: true
          });
          log(`Sort Code: ${value}, formatted to: ${sortCodeField.value}`);
        });
      }
    }
    accountNumber(field) {
      const accountNumberField = document.getElementsByName(field)[0];
      if (accountNumberField) {
        accountNumberField.addEventListener("input", (e2) => {
          const value = e2.target.value;
          accountNumberField.value = s(value, {
            blocks: [8],
            numericOnly: true
          });
          log(`Account Number: ${value}, formatted to: ${accountNumberField.value}`);
        });
      }
    }
    amountOther(field = "transaction.donationAmt.other") {
      const otherAmountField = document.getElementsByName(field)[0];
      if (otherAmountField) {
        otherAmountField.addEventListener("input", (e2) => {
          const value = e2.target.value;
          otherAmountField.value = M(value, {
            numeralThousandsGroupStyle: "none"
          });
          log(`Amount Other: ${value}, formatted to: ${otherAmountField.value}`);
        });
      }
    }
    noSpaces(field = "") {
      const fields = document.querySelectorAll(field);
      fields.forEach((field2) => {
        field2.addEventListener("input", () => {
          field2.value = field2.value.replace(/\s+/g, "");
        });
      });
    }
    removeErrorsOnInput() {
      const fields = document.querySelectorAll("input, select, textarea");
      fields.forEach((field) => {
        field.addEventListener("input", (e2) => {
          const fieldContainer = e2.target.closest(".en__field");
          const hasError = fieldContainer?.classList.contains("en__field--validationFailed");
          if (hasError) {
            fieldContainer.classList.remove("en__field--validationFailed");
            const errorMessage = fieldContainer.querySelector(".en__field__error");
            if (errorMessage) {
              errorMessage.style.display = "none";
            }
          }
        });
      });
    }
  };

  // src/enx.js
  var ENX = class {
    constructor(config = {}) {
      const defaultConfig = {
        debug: new URLSearchParams(window.location.search).has("debug"),
        proxies: [],
        liveValidation: {
          enabled: true,
          removeErrorsOnInput: true,
          sortCodeField: "supporter.bankRoutingNumber",
          accountNumberField: "supporter.bankAccountNumber"
        },
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
        this.enxHelpers = helpers_exports;
        this.enxModel = new ENXModel();
        this.enxProxyFields = new ENXProxyFields(this.config.proxies);
        this.enxMultiStepForm = new ENXMultiStepForm();
        this.enxShow = new ENXShow();
        this.enxShare = new ENXShare();
        this.enxReadMoreMobile = new ENXReadMoreMobile();
        this.enxText = new ENXText();
        this.enxHtml = new ENXHtml();
        this.enxEmailTarget = new ENXEmailTarget();
        this.enxTweetTarget = new ENXTweetTarget();
        this.enxDonate = new ENXDonate();
        this.enxLiveValidation = new ENXLiveValidation(this.config.liveValidation);
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
