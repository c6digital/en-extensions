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
