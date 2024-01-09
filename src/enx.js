import * as helpers from "./helpers";
import ENXModel from "./enx-model";
import ENXProxyFields from "./enx-proxy-fields";
import ENXCloak from "./enx-cloak";
import ENXMultiStepForm from "./enx-multi-step-form";
import ENXShow from "./enx-show";
import ENXShare from "./enx-share";
import ENXReadMoreMobile from "./enx-read-more-mobile";
import ENXText from "./enx-text";
import ENXHtml from "./enx-html";
import ENXEmailTarget from "./enx-email-target";
import ENXTweetTarget from "./enx-tweet-target";
import ENXDonate from "./enx-donate";

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
      this.enxHelpers = helpers;
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
