export const defaultConfig = {
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
    accountNumberField: "supporter.bankAccountNumber",
  },
  enxWidget: {
    type: "petition", // petition, fundraising
    metric: "participatingSupporters", // totalAmountDonated, totalNumberOfDonations
    offsetCount: 0,
    hiddenUntilCount: 0,
    token: "ad33adbe-154d-4ac9-93c7-d60796a39b98",
  },
  beforeInit: () => {},
  beforeCloakRemoval: () => {},
  afterInit: () => {},
};
