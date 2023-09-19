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
