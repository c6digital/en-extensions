import ENXModel from "./enx-model";
import ENXProxyFields from "./enx-proxy-fields";
import ENXCloak from "./enx-cloak";
import ENXMultiStepForm from "./enx-multi-step-form";
import * as helpers from "./helpers";

export default class ENX {
  constructor(config = {}) {
    const defaultConfig = {
      proxies: [],
      beforeInit: () => {},
      beforeCloakRemoval: () => {},
      afterInit: () => {},
    };

    this.config = {
      ...defaultConfig,
      ...config,
    };

    this.config.beforeInit();

    this.waitForEnDefaults().then(() => {
      this.model = new ENXModel();
      this.proxyFields = new ENXProxyFields(this.config.proxies);
      this.multiStepForm = new ENXMultiStepForm();
      this.helpers = helpers;

      // These must come last
      this.config.beforeCloakRemoval();
      this.cloak = new ENXCloak();
      this.config.afterInit();
    });
  }

  waitForEnDefaults() {
    return new Promise((resolve) => {
      function checkEnDefaults() {
        if (window.EngagingNetworks.require._defined.enDefaults !== undefined) {
          resolve();
        } else {
          setTimeout(checkEnDefaults, 50);
        }
      }
      checkEnDefaults();
    });
  }
}
