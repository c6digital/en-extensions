import * as helpers from "./helpers";
import { defaultConfig } from "./default-config";
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
import ENXValidate from "./enx-validate";
import ENXConvert from "./enx-convert";
import ENXWidget from "./enx-widget";

export default class ENX {
  constructor(config = {}) {
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
      this.enxHelpers.transformEnxClassesToDataAttributes();
      this.enxModel = new ENXModel();
      this.enxProxyFields = new ENXProxyFields(this.config.enxProxyFields);
      this.enxMultiStepForm = new ENXMultiStepForm();
      this.enxShow = new ENXShow();
      this.enxShare = new ENXShare();
      this.enxReadMoreMobile = new ENXReadMoreMobile();
      this.enxText = new ENXText();
      this.enxHtml = new ENXHtml();
      this.enxEmailTarget = new ENXEmailTarget();
      this.enxTweetTarget = new ENXTweetTarget();
      this.enxDonate = new ENXDonate();
      this.enxValidate = new ENXValidate(this.config.validate);
      this.enxConvert = new ENXConvert();
      this.enxWidget = new ENXWidget(this.config.enxWidget);

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

  static getConfigValue(key) {
    return window.ENXConfig.hasOwnProperty(key) ? window.ENXConfig[key] : null;
  }
}
