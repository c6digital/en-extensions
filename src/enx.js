import * as helpers from "./helpers";
import ENXModel from "./enx-model";
import ENXProxyFields from "./enx-proxy-fields";
import ENXCloak from "./enx-cloak";
import ENXMultiStepForm from "./enx-multi-step-form";
import ENXShow from "./enx-show";

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

    if (window.hasOwnProperty("ENXPageConfig")) {
      this.config = {
        ...this.config,
        ...window.ENXPageConfig,
      };
    }

    window.ENXConfig = this.config;

    this.config.beforeInit();

    this.waitForEnDefaults().then(() => {
      this.helpers = helpers;
      this.model = new ENXModel();
      this.proxyFields = new ENXProxyFields(this.config.proxies);
      this.multiStepForm = new ENXMultiStepForm();
      this.show = new ENXShow();

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
