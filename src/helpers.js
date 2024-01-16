export function getENFieldValue(field, sessionFallback = true) {
  const fieldValue = window.EngagingNetworks.require._defined.enDefaults.getFieldValue(field);
  if (fieldValue) return fieldValue;
  if (sessionFallback) return getENSupporterData(field);
  return null;
}

export function getENSupporterData(field) {
  return window.EngagingNetworks.require._defined.enDefaults.getSupporterData(field);
}

export function setENFieldValue(field, value) {
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
  return getENFieldValue("paycurrency") || getENFieldValue("currency") || "USD";
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
  saveFieldValueToSessionStorage("donationAmt");
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
