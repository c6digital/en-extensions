export function getENFieldValue(field, sessionFallback = true) {
  const fieldValue = window.EngagingNetworks.require._defined.enDefaults.getFieldValue(field);
  if (fieldValue) return fieldValue;
  if (sessionFallback) return getENSupporterData(field);
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
