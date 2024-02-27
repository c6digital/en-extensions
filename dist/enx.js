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
    fetchJSONP: () => fetchJSONP,
    getCampaignData: () => getCampaignData,
    getClientID: () => getClientID,
    getComponentAttribute: () => getComponentAttribute,
    getComponentAttributes: () => getComponentAttributes,
    getCurrency: () => getCurrency,
    getCurrencySymbol: () => getCurrencySymbol,
    getDataCenter: () => getDataCenter,
    getDataFromStorage: () => getDataFromStorage,
    getENFieldValue: () => getENFieldValue,
    getENSupporterData: () => getENSupporterData,
    getENValidators: () => getENValidators,
    getElementsOfComponent: () => getElementsOfComponent,
    getElementsWithComponentAttribute: () => getElementsWithComponentAttribute,
    getEnPageLocale: () => getEnPageLocale,
    getFirstElementWithComponentAttribute: () => getFirstElementWithComponentAttribute,
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
    transformEnxClassesToDataAttributes: () => transformEnxClassesToDataAttributes,
    updateCurrentYear: () => updateCurrentYear,
    updateNextPageUrl: () => updateNextPageUrl,
    validateVisibleFields: () => validateVisibleFields
  });
  function getENFieldValue(field, sessionFallback = true) {
    const enFieldName = field.split(".")[1];
    let fieldValue = window.EngagingNetworks.require._defined.enDefaults.getFieldValue(enFieldName);
    if (fieldValue) {
      return fieldValue;
    }
    fieldValue = getENSupporterData(enFieldName, false);
    if (sessionFallback && fieldValue) {
      return fieldValue;
    }
    const fieldElements = document.querySelectorAll(`[name="${field}"]`);
    for (const fieldElement of fieldElements) {
      if (fieldElement.type === "checkbox" || fieldElement.type === "radio") {
        if (fieldElement.checked) {
          return fieldElement.value;
        }
      } else {
        return fieldElement.value;
      }
    }
    return null;
  }
  function getENSupporterData(field, sliceFieldName = true) {
    if (sliceFieldName) {
      field = field.split(".")[1];
    }
    return window.EngagingNetworks.require._defined.enDefaults.getSupporterData(field);
  }
  function setENFieldValue(field, value, sliceFieldName = true) {
    if (sliceFieldName) {
      field = field.split(".")[1];
    }
    window.EngagingNetworks.require._defined.enDefaults.setFieldValue(field, value);
  }
  function getENValidators() {
    return window.EngagingNetworks.require._defined.enValidation.validation.validators;
  }
  function getVisibleValidators() {
    return getENValidators().filter((x2) => {
      return !!document.querySelector("[class*='enx-multistep:active'] .en__field--" + x2.field);
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
    return getENFieldValue("transaction.paycurrency") || getENFieldValue("transaction.currency") || "USD";
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
    saveFieldValueToSessionStorage("transaction.donationAmt", "donationAmt");
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
  function transformEnxClassesToDataAttributes(selector = "[class*='enx-']") {
    let elements;
    if (typeof selector instanceof NodeList) {
      elements = selector;
    } else if (selector instanceof HTMLElement) {
      elements = [selector];
    } else {
      elements = document.querySelectorAll(selector);
    }
    elements.forEach((element) => {
      const classes = element.className.split(" ");
      let dataAttributes = null;
      classes.forEach((className) => {
        if (!className.includes("enx-"))
          return;
        dataAttributes = dataAttributes || [];
        const parts = className.split(/[\[\]]/).filter(Boolean);
        const componentName = parts[0].split(":")[0];
        const attributes = {};
        for (let i2 = 1; i2 < parts.length; i2++) {
          const [key, value] = parts[i2].split("=");
          attributes[key] = value;
        }
        const componentDataAttribute = dataAttributes.find(
          (data) => data.componentName === componentName
        );
        if (componentDataAttribute) {
          componentDataAttribute.attributes.push(attributes);
        } else {
          dataAttributes.push({
            componentName,
            attributes: Object.keys(attributes).length > 0 ? [attributes] : []
          });
        }
      });
      if (!dataAttributes)
        return;
      dataAttributes.forEach((data) => {
        const attributeData = data.attributes.length > 0 ? JSON.stringify(data.attributes) : "";
        element.setAttribute(`data-${data.componentName}`, attributeData);
        log(`Data attribute set "data-${data.componentName}" = ${attributeData}`);
      });
    });
  }
  function getElementsOfComponent(component) {
    return document.querySelectorAll(`[data-enx-${component}]`);
  }
  function getComponentAttributes(element, component) {
    const attributeValue = element.getAttribute(`data-enx-${component}`);
    if (!attributeValue)
      return null;
    try {
      return JSON.parse(attributeValue);
    } catch (e2) {
      log(`Error parsing JSON "${attributeValue}" for "enx-${component}"`);
      return [];
    }
  }
  function getComponentAttribute(element, component, attribute) {
    const attributes = getComponentAttributes(element, component);
    if (attributes) {
      return attributes[0][attribute] || null;
    }
    return null;
  }
  function getElementsWithComponentAttribute(componentName, attributeName, attributeValue = null) {
    const elements = getElementsOfComponent(componentName);
    return [...elements].filter((el) => {
      const attributeData = getComponentAttributes(el, componentName);
      if (attributeValue) {
        return attributeData ? attributeData.some((obj) => obj[attributeName] === attributeValue) : false;
      } else {
        return attributeData ? attributeData.some((obj) => obj[attributeName]) : false;
      }
    });
  }
  function getFirstElementWithComponentAttribute(componentName, attributeName, attributeValue = null) {
    return getElementsWithComponentAttribute(componentName, attributeName, attributeValue)[0];
  }
  async function getCampaignData(campaignId = false, apiService = "EaDataCapture", token = "") {
    if (!campaignId) {
      if (!window.pageJson) {
        throw new Error("No campaign ID provided and no pageJson found");
      }
      campaignId = window.pageJson.campaignId;
    }
    return await fetchJSONP(
      `https://${getDataCenter()}.engagingnetworks.app/ea-dataservice/data.service?service=${apiService}&campaignId=${campaignId}&token=${token}&contentType=json`
    );
  }
  function getClientID() {
    if (!window.pageJson)
      return 0;
    return window.pageJson.clientId;
  }
  function getDataCenter() {
    return getClientID() >= 1e4 ? "us" : "ca";
  }
  async function fetchJSONP(url) {
    return new Promise((resolve, reject) => {
      let script = document.createElement("script");
      let name = "_enx_jsonp_" + Math.floor(Math.random() * 1e4);
      if (url.match(/\?/)) {
        url += "&callback=" + name;
      } else {
        url += "?callback=" + name;
      }
      window[name] = (json) => {
        resolve(json);
        script.remove();
        delete window[name];
      };
      script.onerror = (error) => {
        reject(error);
        script.remove();
        delete window[name];
      };
      script.src = url;
      document.body.appendChild(script);
    });
  }

  // src/default-config.js
  var defaultConfig = {
    debug: new URLSearchParams(window.location.search).has("debug"),
    enxCloak: true,
    enxConvert: true,
    enxDonate: true,
    enxEmailTarget: true,
    enxHtml: true,
    enxModel: true,
    enxMultiStepForm: true,
    enxProxyFields: true,
    enxReadMoreMobile: true,
    enxShare: true,
    enxShow: true,
    enxText: true,
    enxTweetTarget: true,
    enxValidate: {
      removeErrorsOnInput: true,
      sortCodeField: "supporter.bankRoutingNumber",
      accountNumberField: "supporter.bankAccountNumber"
    },
    enxWidget: {
      type: "petition",
      // petition, fundraising
      metric: "participatingSupporters",
      // totalAmountDonated, totalNumberOfDonations
      offsetCount: 0,
      hiddenUntilCount: 0,
      token: "ad33adbe-154d-4ac9-93c7-d60796a39b98"
    },
    beforeInit: () => {
    },
    beforeCloakRemoval: () => {
    },
    afterInit: () => {
    }
  };

  // src/enx-model.js
  var ENXModel = class {
    constructor() {
      if (!this.isEnabled())
        return;
      this.bindTargets = [...getElementsOfComponent("model")];
      if (this.bindTargets.length > 0) {
        this.run();
      }
    }
    isEnabled() {
      return ENX.getConfigValue("enxModel") !== false;
    }
    run() {
      const bindSources = this.bindTargets.map((el) => {
        const attr = getComponentAttributes(el, "model");
        return attr[0].source;
      });
      const uniqueBindSources = [...new Set(bindSources)];
      uniqueBindSources.forEach((bindSource) => {
        const inputs = [...document.querySelectorAll(`[name="${bindSource}"]`)];
        inputs.forEach((input) => {
          input.addEventListener("input", () => {
            this.updateTargetsWithSourceValue(bindSource);
          });
          this.updateTargetsWithSourceValue(bindSource);
        });
      });
    }
    updateTargetsWithSourceValue(sourceFieldName) {
      const elements = getElementsWithComponentAttribute("model", "source", sourceFieldName);
      elements.forEach((element) => {
        element.textContent = getENFieldValue(sourceFieldName);
      });
    }
  };

  // src/enx-proxy-fields.js
  var ENXProxyFields = class {
    constructor(proxies = []) {
      if (!this.isEnabled())
        return;
      this.proxies = [...proxies, ...this.getProxyFieldsFromLabels()];
      if (this.proxies.length > 0) {
        this.activateProxyFields();
      }
    }
    isEnabled() {
      return ENX.getConfigValue("enxProxyFields") !== false;
    }
    getProxyFieldsFromLabels() {
      const proxyFields = [];
      const labels = document.querySelectorAll("label");
      labels.forEach((label) => {
        const labelText = label.textContent;
        if (labelText.includes("enx-proxy[")) {
          let source = /enx-proxy\[source=(.*)]/gi.exec(labelText);
          const target = document.getElementById(label.getAttribute("for"))?.getAttribute("name");
          if (source && target) {
            proxyFields.push({
              source: source[1],
              target
            });
          }
        }
      });
      return proxyFields;
    }
    activateProxyFields() {
      this.proxies.forEach((proxy) => {
        const sourceField = proxy.source;
        const targetField = proxy.target;
        const targetFieldInput = document.querySelector(`[name="${targetField}"]`);
        const targetFieldContainer = targetFieldInput?.closest(".en__field");
        targetFieldContainer?.classList.add("enx-hidden");
        document.querySelectorAll(`[name="${sourceField}"]`).forEach((input) => {
          input.addEventListener("change", () => {
            setENFieldValue(targetField, getENFieldValue(sourceField));
            log(
              `Proxy field "${targetField}" updated with value "${getENFieldValue(
                sourceField
              )}" from "${sourceField}"`
            );
          });
        });
        setENFieldValue(targetField, getENFieldValue(sourceField));
        log(
          `Proxy field "${targetField}" updated with value "${getENFieldValue(
            sourceField
          )}" from "${sourceField}"`
        );
      });
    }
  };

  // src/enx-cloak.js
  var ENXCloak = class {
    constructor() {
      if (!this.isEnabled())
        return;
      const elements = getElementsOfComponent("cloak");
      if (elements) {
        elements.forEach((el) => {
          el.classList.remove("enx-cloak");
        });
      }
    }
    isEnabled() {
      return ENX.getConfigValue("enxCloak") !== false;
    }
  };

  // src/enx-multi-step-form.js
  var ENXMultiStepForm = class {
    constructor() {
      if (!this.isEnabled())
        return;
      if (!this.shouldRun())
        return;
      this.currentStep = 0;
      this.multistepTabs = [];
      this.init();
    }
    init() {
      this.resetTabs();
      this.onUrlHit();
      this.onBackButton();
      this.addButtonEventListeners();
    }
    isEnabled() {
      return ENX.getConfigValue("enxMultiStepForm") !== false;
    }
    shouldRun() {
      return !!document.querySelector("[class*='enx-multistep']");
    }
    resetTabs() {
      this.currentStep = 0;
      this.multistepTabs = [...getElementsOfComponent("multistep")].map((tab) => {
        return getComponentAttribute(tab, "multistep", "name");
      }).filter(Boolean);
    }
    // Via Direct URL hit
    onUrlHit() {
      const urlParams = new URLSearchParams(window.location.search);
      const forceStartEl = getFirstElementWithComponentAttribute("multistep", "force-start", "true");
      if (forceStartEl && !urlParams.has("enx-multistep-override-force")) {
        this.changeStep(forceStartEl);
        history.pushState(null, "", "#");
        this.log("URL", "Show Landing page");
        return;
      }
      if (window.location.hash) {
        const destination = location.hash.replace("#", "");
        const stepFromHash = getFirstElementWithComponentAttribute("multistep", "name", destination);
        if (stepFromHash) {
          this.changeStep(stepFromHash);
          this.log("URL", 'Show "' + location.hash + '"');
          this.setStep(destination);
          return;
        }
      }
      this.changeStep(getFirstElementWithComponentAttribute("multistep", "name"));
    }
    onBackButton() {
      window.onpopstate = (event) => {
        if (event.state) {
          this.changeStep(
            getFirstElementWithComponentAttribute("multistep", "name", event.state.page)
          );
          this.log("Browser", 'Show "' + event.state.page + '"');
          this.setStep(event.state.page);
        } else {
          this.changeStep(getFirstElementWithComponentAttribute("multistep", "name"));
          this.log("Browser", "Show Landing page");
          this.setStep(this.multistepTabs[0]);
        }
      };
    }
    addButtonEventListeners() {
      const multistepButtons = getElementsWithComponentAttribute("multistep", "destination");
      multistepButtons.forEach((button) => {
        button.addEventListener("click", this.onButtonClick.bind(this));
      });
    }
    onButtonClick(event) {
      const destination = getComponentAttribute(event.target, "multistep", "destination");
      const destinationIndex = this.multistepTabs.indexOf(destination);
      const validate = !getComponentAttribute(event.target, "multistep", "no-validate") && this.currentStep < destinationIndex;
      if (this.currentStep === destinationIndex || validate && destinationIndex > this.currentStep + 1)
        return;
      if (validate && !validateVisibleFields()) {
        window.dispatchEvent(
          new CustomEvent("enx-multistep:error", {
            detail: this.multistepTabs[this.currentStep].className
          })
        );
        return;
      }
      this.changeStep(getFirstElementWithComponentAttribute("multistep", "name", destination));
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
  };

  // src/enx-show.js
  var ENXShow = class {
    constructor() {
      if (!this.isEnabled())
        return;
      this.init();
      this.legacyFunctionality();
    }
    init() {
      const elements = getElementsOfComponent("show");
      elements.forEach((element) => {
        const sourceFieldName = getComponentAttribute(element, "show", "field");
        const sourceFieldValue = getComponentAttribute(element, "show", "value");
        const inputs = document.getElementsByName(sourceFieldName);
        if (inputs.length === 0) {
          element.classList.add("enx-hidden");
        }
        inputs.forEach((input) => {
          if (input.type === "radio" || input.type === "checkbox") {
            if (input.value === sourceFieldValue && input.checked) {
              element.classList.remove("enx-hidden");
            } else {
              element.classList.add("enx-hidden");
            }
          } else if (input.value === sourceFieldValue) {
            element.classList.remove("enx-hidden");
          } else {
            element.classList.add("enx-hidden");
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
      const elements = getElementsOfComponent("show");
      elements.forEach((element) => {
        const sourceFieldName = getComponentAttribute(element, "show", "field");
        const sourceFieldValue = getComponentAttribute(element, "show", "value");
        if (sourceFieldName !== fieldName)
          return;
        if (sourceFieldValue === fieldValue) {
          log(
            `showing element with class enx-show[field=${sourceFieldName}][value=${sourceFieldValue}]`
          );
          element.classList.remove("enx-hidden");
        } else {
          log(
            `hiding element with class enx-show[field=${sourceFieldName}][value=${sourceFieldValue}]`
          );
          element.classList.add("enx-hidden");
        }
      });
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
      const val = getENSupporterData("transaction.recurrpay");
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
      const val = getENSupporterData("transaction.taxdeductible");
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
      const val = getENSupporterData("transaction.paymenttype");
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
    isEnabled() {
      return ENX.getConfigValue("enxShow") !== false;
    }
  };

  // src/enx-share.js
  var ENXShare = class {
    constructor() {
      if (!this.isEnabled())
        return;
      this.svgUrl = "https://storage.c6-digital.net/en-components/img/share-icons/";
      this.shareLabels = {
        en: "Share on",
        fr: "Partager sur",
        de: "Teilen auf",
        es: "Compartir en",
        it: "Condividi su"
      };
      this.customShareSettings = {
        facebook: {
          url: "https://www.facebook.com/sharer/sharer.php?u=",
          msgSelector: "[class*='enx-share:facebook-link']",
          btnSelector: "[class*='enx-share:facebook-button']"
        },
        twitter: {
          url: "https://twitter.com/intent/tweet?text=",
          msgSelector: "[class*='enx-share:twitter-msg']",
          btnSelector: "[class*='enx-share:twitter-button']"
        },
        whatsapp: {
          url: "https://api.whatsapp.com/send?text=",
          msgSelector: "[class*='enx-share:whatsapp-msg']",
          btnSelector: "[class*='enx-share:whatsapp-button']"
        },
        email: {
          subjectUrl: "mailto:?subject=",
          subjectSelector: "[class*='enx-share:email-subject']",
          bodyUrl: "&body=",
          bodySelector: "[class*='enx-share:email-body']",
          btnSelector: "[class*='enx-share:email-button']"
        }
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
          }, 2e3);
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
              config.subjectUrl + encodeURIComponent(subject) + config.bodyUrl + encodeURIComponent(body)
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
  };

  // src/enx-read-more-mobile.js
  var ENXReadMoreMobile = class {
    constructor() {
      if (!this.isEnabled())
        return;
      this.readMoreSections = getElementsOfComponent("read-more-mobile");
      if (this.readMoreSections.length > 0) {
        this.addReadMoreSections();
      }
    }
    addReadMoreSections() {
      this.readMoreSections.forEach((section) => {
        let numberElsToWrap = getComponentAttribute(section, "read-more-mobile", "visible") ?? 2;
        const els = [...section.children].slice(numberElsToWrap);
        const wrapper = document.createElement("div");
        wrapper.className = "enx-read-more:content-mobile";
        els.forEach((element) => {
          wrapper.appendChild(element);
        });
        section.appendChild(wrapper);
        wrapper.insertAdjacentHTML(
          "beforebegin",
          `<a style="text-decoration: none; cursor: pointer;" class="enx-read-more:toggle">
          Read more
          <svg
            class="rm-icon-normal"
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
            class="rm-icon-expanded"
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
      document.querySelectorAll(".enx-read-more\\:toggle").forEach((toggle) => {
        toggle.addEventListener("click", () => {
          toggle.closest('[class*="enx-read-more-mobile"]').classList.toggle("enx-read-more-mobile:open");
        });
      });
    }
    isEnabled() {
      return ENX.getConfigValue("enxReadMoreMobile") !== false;
    }
  };

  // src/enx-text.js
  var ENXText = class {
    constructor() {
      if (!this.isEnabled())
        return;
      this.run();
    }
    run() {
      const elements = getElementsOfComponent("text");
      if (elements.length > 0) {
        elements.forEach((el) => {
          const config = getComponentAttributes(el, "text");
          if (config) {
            config.forEach((attr) => {
              const sourceEl = document.querySelector(`.${attr.source}`);
              if (sourceEl) {
                el.textContent = sourceEl.textContent;
              }
            });
          }
        });
      }
    }
    isEnabled() {
      return ENX.getConfigValue("enxText") !== false;
    }
  };

  // src/enx-html.js
  var ENXHtml = class {
    constructor() {
      if (!this.isEnabled())
        return;
      this.run();
    }
    run() {
      const elements = getElementsOfComponent("html");
      if (elements.length > 0) {
        elements.forEach((el) => {
          const config = getComponentAttributes(el, "html");
          if (config) {
            config.forEach((attr) => {
              const sourceEl = document.querySelector(`.${attr.source}`);
              if (sourceEl) {
                el.innerHTML = sourceEl.innerHTML;
              }
            });
          }
        });
      }
    }
    isEnabled() {
      return ENX.getConfigValue("enxHtml") !== false;
    }
  };

  // src/enx-email-target.js
  var ENXEmailTarget = class {
    constructor() {
      if (!this.isEnabled())
        return;
      this.addPhotoOfMP();
    }
    addPhotoOfMP() {
      const imageEls = document.querySelectorAll("img[data-mp-location][data-mp-name]");
      if (imageEls.length === 0)
        return;
      imageEls.forEach(async (img) => {
        img.src = await getMPPhotoUrl(img.dataset.mpName, img.dataset.mpLocation);
      });
    }
    isEnabled() {
      return ENX.getConfigValue("enxEmailTarget") !== false;
    }
  };

  // src/enx-tweet-target.js
  var ENXTweetTarget = class {
    constructor() {
      if (!this.isEnabled())
        return;
      if (!this.shouldRun())
        return;
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
      const defaultConfig2 = {
        "custom-tweets": true,
        "mp-photo": true,
        "hide-background-tab": true,
        "hide-sent-btn": true,
        "show-target-profile": true,
        "redirect-on-tweet": true
      };
      const componentAttrs = getComponentAttributes(tweetTargetEl, "tweet-target");
      const componentConfig = componentAttrs ? componentAttrs[0] : {};
      const config = {
        ...defaultConfig2,
        ...componentConfig
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
      if (document.querySelectorAll(
        "[class*='enx-tweet-target:custom-tweets'] .en__component--copyblock"
      ).length === 0) {
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
  };

  // src/enx-donate.js
  var ENXDonate = class {
    constructor() {
      if (!this.isEnabled())
        return;
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
    isEnabled() {
      return ENX.getConfigValue("enxDonate") !== false;
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

  // src/enx-validate.js
  var ENXValidate = class {
    constructor(config = false) {
      if (!this.isEnabled())
        return;
      this.config = config;
      this.email();
      this.creditCard();
      this.cvv();
      this.sortCode(this.config.sortCodeField);
      this.accountNumber(this.config.accountNumberField);
      this.amountOther();
      this.noSpaces('enx-validate[rule="no-spaces"]');
      if (this.config.removeErrorsOnInput) {
        this.removeErrorsOnInput();
      }
    }
    isEnabled() {
      return ENX.getConfigValue("enxValidate") !== false;
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

  // src/enx-convert.js
  var ENXConvert = class {
    constructor() {
      if (!this.isEnabled())
        return;
      if (!window.pageJson) {
        log("No pageJson found, not running ENXConvert");
        return false;
      }
      this.pages = this.getPagesLog();
      this.previousPage = this.pages[this.pages.length - 1] || null;
      this.currentPage = new Page(window.pageJson);
      this.updatePagesLog();
      if (this.hasAlreadyConverted() || window.hasOwnProperty("ENConversion_DontConvert") && window.ENConversion_DontConvert === true) {
        return;
      }
      if (window.hasOwnProperty("ENConversion_Convert") && window.ENConversion_Convert === true) {
        this.convert();
        return;
      }
      this.checkForConversion();
    }
    checkForConversion() {
      if (
        //last page of multiple pages without a redirect
        this.currentPage.isLastPage() && this.currentPage.hasMoreThanOnePage() && !this.currentPage.hasRedirect()
      ) {
        this.convert();
      } else if (
        //single page with redirect
        this.currentPage.isSinglePage() && this.currentPage.hasRedirect()
      ) {
        this.convert();
      }
    }
    convert() {
      sessionStorage.setItem(
        "ENConversion_Converted_" + this.currentPage.pageJson.campaignId,
        "true"
      );
      log("ENXConvert: Converted");
      this.dispatchEvents();
    }
    dispatchEvents = function() {
      let groupEventName;
      switch (this.currentPage.pageJson.pageType) {
        case "donation":
        case "premiumgift":
        case "e-commerce":
          groupEventName = "donation";
          break;
        default:
          groupEventName = "submission";
          break;
      }
      const generalEvent = new Event("synthetic-en:conversion", { bubbles: true });
      const pageEvent = new Event("synthetic-en:conversion:" + this.currentPage.pageJson.pageType, {
        bubbles: true
      });
      const groupEvent = new Event("synthetic-en:conversion:group:" + groupEventName, {
        bubbles: true
      });
      dispatchEvent(generalEvent);
      dispatchEvent(pageEvent);
      dispatchEvent(groupEvent);
    };
    hasAlreadyConverted() {
      return sessionStorage.getItem("ENConversion_Converted_" + this.currentPage.pageJson.campaignId) !== null;
    }
    getPagesLog() {
      const pagesData = JSON.parse(sessionStorage.getItem("ENConversion_PagesLog"));
      if (pagesData === null) {
        return [];
      }
      return pagesData.map(function(pageData) {
        return new Page(pageData);
      });
    }
    updatePagesLog() {
      const pages = JSON.parse(sessionStorage.getItem("ENConversion_PagesLog"));
      if (pages === null) {
        sessionStorage.setItem("ENConversion_PagesLog", JSON.stringify([this.currentPage.pageJson]));
      } else {
        if (!this.currentPage.isSamePageAs(this.previousPage)) {
          pages.push(this.currentPage.pageJson);
        }
        sessionStorage.setItem("ENConversion_PagesLog", JSON.stringify(pages));
      }
    }
    isEnabled() {
      return ENX.getConfigValue("enxConvert") !== false;
    }
  };
  var Page = class {
    /**
     * @param {
     *  {
     *    pageNumber: number,
     *    pageCount: number,
     *    redirectPresent: boolean,
     *    campaignPageId: number,
     *    campaignId: number,
     *    pageType: string
     *  }
     * } pageJson
     */
    constructor(pageJson) {
      this.pageJson = pageJson;
    }
    isLastPage() {
      return this.pageJson.pageNumber === this.pageJson.pageCount;
    }
    hasMoreThanOnePage() {
      return this.pageJson.pageCount > 1;
    }
    isSinglePage() {
      return this.pageJson.pageCount === 1;
    }
    hasRedirect() {
      return this.pageJson.redirectPresent;
    }
    hasPagesLeft() {
      return this.pageJson.pageNumber < this.pageJson.pageCount;
    }
    /**
     * A page to compare this page to
     * @param {Page} page
     */
    isSamePageAs(page) {
      return this.pageJson.campaignPageId === page.pageJson.campaignPageId && this.pageJson.pageNumber === page.pageJson.pageNumber;
    }
  };

  // src/enx-widget.js
  var ENXWidget = class {
    constructor(config) {
      if (!this.isEnabled())
        return;
      this.config = typeof config === "object" ? config : {};
      this.setupEnProgressBarWidget();
    }
    isEnabled() {
      return ENX.getConfigValue("enxWidget") !== false;
    }
    async setupEnProgressBarWidget() {
      const thermometer = document.querySelector(".enWidget.enWidget--progressBar");
      const counterText = document.querySelector(".signature-counter");
      if (!thermometer && !counterText) {
        log("ENXWidget: No progress bar or counter text found, skipping widget setup");
        return;
      }
      thermometer?.classList.add("enx-hidden");
      counterText?.classList.add("enx-hidden");
      const campaignId = window.pageJson && window.pageJson.campaignId;
      const apiService = this.config.type === "petition" ? "EaDataCapture" : "FundraisingSummary";
      const responseData = await getCampaignData(campaignId, apiService, this.config.token);
      if (!responseData || !responseData.rows) {
        log("ENXWidget: No API response found, skipping widget setup");
        return;
      }
      const responseCount = responseData.rows[0].columns.find(
        (column) => column.name === this.config.metric
      ).value;
      const totalCount = parseInt(responseCount || 0) + this.config.offsetCount;
      if (!totalCount) {
        log("ENXWidget: No total count found in API response, skipping widget setup");
        return;
      }
      if (this.config.hiddenUntilCount && this.config.hiddenUntilCount > totalCount) {
        log(
          `ENXWidget: Total count ${totalCount} is less than hiddenUntilCount, skipping widget setup`
        );
        return;
      }
      const target = this.getTarget(totalCount);
      const remaining = target - totalCount;
      const percent = (totalCount * 100 / target).toFixed(0) + "%";
      if (counterText) {
        counterText.innerHTML = counterText.innerHTML.replace("{signature.remaining}", remaining.toLocaleString()).replace("{signature.percent}", percent).replace("{signature.count}", totalCount.toLocaleString()).replace("{signature.target}", target.toLocaleString());
        counterText.classList.remove("enx-hidden");
      }
      if (thermometer) {
        const thermometerFill = thermometer.querySelector(".enWidget__fill");
        if (thermometerFill) {
          thermometerFill.style.width = "0%";
          thermometerFill.style.height = "100%";
          thermometer.classList.remove("enx-hidden");
          thermometerFill.style.width = percent;
          thermometer.classList.remove("enx-hidden");
        }
      }
      log(
        `ENXWidget: ${totalCount} signatures, ${target} target, ${remaining} remaining, ${percent} complete`
      );
    }
    getTarget(signatureCount) {
      const signatureNumber = parseInt(signatureCount) * 1.05;
      let target = Math.ceil(signatureNumber / 5e5) * 5e5;
      if (signatureNumber < 15e3) {
        target = Math.ceil(signatureNumber / 5e3) * 5e3;
      } else if (signatureNumber < 5e4) {
        target = Math.ceil(signatureNumber / 1e4) * 1e4;
      } else if (signatureNumber < 2e5) {
        target = Math.ceil(signatureNumber / 5e4) * 5e4;
      } else if (signatureNumber < 5e5) {
        target = Math.ceil(signatureNumber / 1e5) * 1e5;
      }
      return target;
    }
  };

  // src/enx.js
  var ENX2 = class {
    constructor(config = {}) {
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
        this.enxHelpers.transformEnxClassesToDataAttributes();
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
        this.enxValidate = new ENXValidate(this.config.validate);
        this.enxConvert = new ENXConvert();
        this.enxWidget = new ENXWidget(this.config.enxWidget);
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
    static getConfigValue(key) {
      return window.ENXConfig.hasOwnProperty(key) ? window.ENXConfig[key] : null;
    }
  };

  // src/index.js
  window.ENX = ENX2;
  var src_default = ENX2;
})();
