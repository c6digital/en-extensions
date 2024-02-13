export function getENFieldValue(field, sessionFallback = true) {
  const enFieldName = field.split(".")[1];

  // Try getting field value from EN
  let fieldValue = window.EngagingNetworks.require._defined.enDefaults.getFieldValue(enFieldName);
  if (fieldValue) {
    return fieldValue;
  }

  // Fallback to EN supporter data in EN's session
  fieldValue = getENSupporterData(enFieldName, false);
  if (sessionFallback && fieldValue) {
    return fieldValue;
  }

  // Finally, try getting field value from the DOM
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

  // If no matching element is found or none is checked for checkboxes/radios
  return null;
}

export function getENSupporterData(field, sliceFieldName = true) {
  if (sliceFieldName) {
    field = field.split(".")[1];
  }
  return window.EngagingNetworks.require._defined.enDefaults.getSupporterData(field);
}

export function setENFieldValue(field, value, sliceFieldName = true) {
  if (sliceFieldName) {
    field = field.split(".")[1];
  }
  window.EngagingNetworks.require._defined.enDefaults.setFieldValue(field, value);
}

export function getENValidators() {
  return window.EngagingNetworks.require._defined.enValidation.validation.validators;
}

export function getVisibleValidators() {
  return getENValidators().filter((x) => {
    return !!document.querySelector(".enx-multistep-active .en__field--" + x.field);
  });
}

export function validateVisibleFields() {
  const validationResults = getVisibleValidators().map((validator) => {
    validator.hideMessage();
    return !validator.isVisible() || validator.test();
  });

  return validationResults.every((result) => result);
}

export function shuffleArray(array) {
  var m = array.length,
    t,
    i;

  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

export function getNextPageUrl() {
  return document.querySelector("form.en__component--page")?.getAttribute("action") ?? "";
}

export async function getMPData(name, location) {
  try {
    const data = await fetch(
      `https://members-api.parliament.uk/api/Members/Search?skip=0&take=1&Name=${name}&Location=${location}`
    );
    return await data.json();
  } catch (err) {
    return false;
  }
}

export async function getMPPhotoUrl(name, location) {
  const MP = await getMPData(name, location);
  if (!MP.items[0]) {
    console.log("No MP found for", name, location);
    return "";
  }
  return MP.items[0].value.thumbnailUrl;
}

export function getEnPageLocale() {
  return window.pageJson.locale.substring(0, 2) || "en";
}

export function getCurrency() {
  return (
    getENFieldValue("transaction.paycurrency") || getENFieldValue("transaction.currency") || "USD"
  );
}

export function getCurrencySymbol() {
  return (1.0)
    .toLocaleString(getEnPageLocale(), {
      style: "currency",
      currency: getCurrency(),
    })
    .replace("1.00", "");
}

export function saveFieldValueToSessionStorage(field, key = null) {
  if (!key) key = field;
  sessionStorage.setItem(key, getENFieldValue(field));
}

export function saveDonationAmtToStorage() {
  saveFieldValueToSessionStorage("transaction.donationAmt", "donationAmt");
}

export function displayDonationAmt() {
  const donationAmtDisplay = document.querySelector(".display-donation-amt");
  const donationAmt = sessionStorage.getItem("donationAmt");

  if (donationAmtDisplay && donationAmt) {
    donationAmtDisplay.textContent = donationAmt;
  }
}

export function giftAidCalculation() {
  const giftAidCalculation = document.querySelector(".gift-aid-calculation");
  const donationAmt = sessionStorage.getItem("donationAmt");

  if (giftAidCalculation && donationAmt) {
    let giftAidAmt = (donationAmt / 4) * 5;

    if (giftAidAmt % 1 !== 0) {
      giftAidAmt = giftAidAmt.toFixed(2);
    }

    giftAidCalculation.querySelector(".donation-amt").textContent = donationAmt;
    giftAidCalculation.querySelector(".gift-aid-amt").textContent = giftAidAmt.toString();
    giftAidCalculation.style.display = "block";
  }
}

export function log(message) {
  if (window.ENXConfig.debug) {
    console.log(
      `%c[ENX]: ${message}`,
      "color: #241C15; background-color: #FF3EBF; padding: 4px; font-weight: 400;"
    );
  }
}

export function updateNextPageUrl() {
  const nextButton = document.querySelector(".next-button");
  nextButton?.setAttribute("href", getNextPageUrl());
}

/**
 * Save an array of data to sessionStorage.
 * storageValue should be a CSS selector for the input field
 * @param {Array<{storageKey: string, storageValue: string}>} storageMap
 */
export function saveDataToStorage(storageMap = []) {
  storageMap.forEach((element) => {
    const input = document.querySelector(element.storageValue);
    if (input && input.value) {
      sessionStorage.setItem(element.storageKey, input.value);
    }
  });
}

/**
 * Get an array of data from sessionStorage and update the text of the target element.
 * target should be a CSS selector for the field to update the text of.
 * @param {Array<{target: string, key: string}>} storageMap
 */
export function getDataFromStorage(storageMap = []) {
  storageMap.forEach(function (element) {
    const target = document.querySelector(element.target);
    if (target) {
      target.innerText = sessionStorage.getItem(element.key);
    }
  });
}

export function updateCurrentYear() {
  document.querySelectorAll(".current-year").forEach((el) => {
    el.innerText = new Date().getFullYear();
  });
}

/**
 * @param {Array<{key: string, maxlength: string}>} fields
 */
export function addMaxLength(fields) {
  fields.forEach((field) => {
    document.querySelector(field.key)?.setAttribute("maxlength", field.maxlength);
  });
}

export function disableSubmitButton(spinner = true) {
  const submitButtons = document.querySelectorAll(".en__submit button");

  submitButtons.forEach((button) => {
    button.disabled = true;
    if (spinner) {
      button.innerHTML = `<span class="submit-spinner spinner-border"></span> ${button.innerHTML}`;
    }
  });
}

export function enableSubmitButton() {
  const submitButtons = document.querySelectorAll(".en__submit button");

  submitButtons.forEach((button) => {
    button.disabled = false;
    button.querySelector(".submit-spinner")?.remove();
  });
}

/**
 * Convert ENX classes on elements to ENX data attributes
 * @param {string|HTMLElement|NodeListOf<Element>} selector A CSS selector, an HTMLElement, or a NodeListOf<HTMLElement>
 * @returns {void}
 */
export function transformEnxClassesToDataAttributes(selector = "[class*='enx-']") {
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

    //Looking for any classes on the element that start with "enx-"
    classes.forEach((className) => {
      if (!className.includes("enx-")) return;
      //We handle dataAttributes like this in case there are multiple classes of the same component on the element
      dataAttributes = dataAttributes || [];
      //Getting the component name and attributes (in square brackets) from the class
      const parts = className.split(/[\[\]]/).filter(Boolean);
      // If the first part has a colon, it's a component name with a modifier, so we only want the component name
      const componentName = parts[0].split(":")[0];
      // Getting our attributes from the rest of the parts array
      const attributes = {};
      for (let i = 1; i < parts.length; i++) {
        const [key, value] = parts[i].split("=");
        attributes[key] = value;
      }

      //If we already have data attributes for this component, add the new attributes to the array
      //If not, create a new entry in the array
      /*
      Example entry:
        {
          "componentName": "enx-html",
          "attributes": [{
            "source": "campaign-content",
          }]
        }
      */
      const componentDataAttribute = dataAttributes.find(
        (data) => data.componentName === componentName
      );
      if (componentDataAttribute) {
        componentDataAttribute.attributes.push(attributes);
      } else {
        dataAttributes.push({
          componentName,
          attributes: Object.keys(attributes).length > 0 ? [attributes] : [],
        });
      }
    });

    if (!dataAttributes) return;

    //For each component, add a data attribute to the element
    dataAttributes.forEach((data) => {
      //Component with attributes = JSON string (array of objects)
      //Component without attributes = empty string
      const attributeData = data.attributes.length > 0 ? JSON.stringify(data.attributes) : "";
      element.setAttribute(`data-${data.componentName}`, attributeData);
      log(`Data attribute set "data-${data.componentName}" = ${attributeData}`);
    });
  });
}

/**
 * Get elements of a specific ENX component
 * @param {string} component The ENX component name
 * @returns {NodeListOf<Element>}
 */
export function getElementsOfComponent(component) {
  return document.querySelectorAll(`[data-enx-${component}]`);
}

/**
 * Get the attributes of a specific ENX component on an element
 * @param {Element} element The element to get the attributes from
 * @param {string} component The ENX component name
 * @return {Array<Object>}>
 */
export function getComponentAttributes(element, component) {
  const attributeValue = element.getAttribute(`data-enx-${component}`);
  if (!attributeValue) return null;
  try {
    return JSON.parse(attributeValue);
  } catch (e) {
    log(`Error parsing JSON "${attributeValue}" for "enx-${component}"`);
    return [];
  }
}

/**
 * Get a specific attribute of an ENX component on an element.
 * Returns the first attribute found with that name.
 * @param {Element} element The element to get the attributes from
 * @param {string} component The ENX component name
 * @param attribute The attribute to get
 * @returns {any|null}
 */
export function getComponentAttribute(element, component, attribute) {
  const attributes = getComponentAttributes(element, component);
  if (attributes) {
    return attributes[0][attribute] || null;
  }
  return null;
}

/**
 * Get elements with a specific attribute on an ENX component
 * @param {string} componentName
 * @param {string} attributeName
 * @param {string|null} attributeValue if value is null, it will return elements with the attribute regardless of value
 * @returns {Element[]}
 */
export function getElementsWithComponentAttribute(
  componentName,
  attributeName,
  attributeValue = null
) {
  const elements = getElementsOfComponent(componentName);

  return [...elements].filter((el) => {
    const attributeData = getComponentAttributes(el, componentName);
    if (attributeValue) {
      return attributeData
        ? attributeData.some((obj) => obj[attributeName] === attributeValue)
        : false;
    } else {
      return attributeData ? attributeData.some((obj) => obj[attributeName]) : false;
    }
  });
}

/**
 * Get the first element with a specific attribute with a specific value on an ENX component
 * @param {string} componentName
 * @param {string} attributeName
 * @param {string|null} attributeValue if value is null, it will return elements with the attribute regardless of value
 * @returns {Element}
 */
export function getFirstElementWithComponentAttribute(
  componentName,
  attributeName,
  attributeValue = null
) {
  return getElementsWithComponentAttribute(componentName, attributeName, attributeValue)[0];
}
