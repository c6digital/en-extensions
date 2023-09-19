import ENXModel from "./enx-model";
import ENXProxyFields from "./enx-proxy-fields";
import ENXCloak from "./enx-cloak";

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
      new ENXModel();
      new ENXProxyFields(this.config.proxies);

      // These must come last
      this.config.beforeCloakRemoval();
      new ENXCloak();
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
