(() => {
  // src/helpers.js
  function getENFieldValue(field, sessionFallback = true) {
    const fieldValue = window.EngagingNetworks.require._defined.enDefaults.getFieldValue(field);
    if (fieldValue)
      return fieldValue;
    if (sessionFallback)
      return getENSupporterData(field);
  }
  function getENSupporterData(field) {
    return window.EngagingNetworks.require._defined.enDefaults.getSupporterData(field);
  }
  function setENFieldValue(field, value) {
    window.EngagingNetworks.require._defined.enDefaults.setFieldValue(field, value);
  }

  // src/enx-model.js
  var ENXModel = class {
    constructor() {
      this.bind();
    }
    bind() {
      const bindNames = [...document.querySelectorAll("[class*='enx-model:']")].map((element) => {
        return element.classList.value.split("enx-model:")[1].split(" ")[0];
      });
      if (bindNames.length === 0)
        return;
      const uniqueBindNames = [...new Set(bindNames)];
      uniqueBindNames.forEach((bindName) => {
        const inputs = [...document.querySelectorAll(`[name="${bindName}"]`)];
        inputs.forEach((input) => {
          input.addEventListener("change", (event) => {
            const className = CSS.escape(`enx-model:${bindName}`);
            const elements = [...document.querySelectorAll(`.${className}`)];
            const value = getENFieldValue(bindName.split(".")[1]);
            elements.forEach((element) => {
              element.textContent = value;
            });
          });
        });
      });
    }
  };

  // src/enx-proxy-fields.js
  var ENXProxyFields = class {
    constructor(config = []) {
      this.config = config;
      this.activateProxyFields();
    }
    activateProxyFields() {
      this.config.forEach((proxy) => {
        const sourceField = proxy.source.split(".")[1];
        const targetField = proxy.target.split(".")[1];
        document.querySelectorAll(`[name="${proxy.source}"]`).forEach((input) => {
          input.addEventListener("change", () => {
            setENFieldValue(targetField, getENSupporterData(sourceField));
          });
        });
        setENFieldValue(targetField, getENSupporterData(sourceField));
      });
    }
  };

  // src/enx-cloak.js
  var ENXCloak = class {
    constructor() {
      document.querySelectorAll(".enx-cloak").forEach((element) => {
        element.classList.remove("enx-cloak");
      });
    }
  };

  // src/enx.js
  var ENX = class {
    constructor(config = {}) {
      const defaultConfig = {
        proxies: [],
        beforeInit: () => {
        },
        beforeCloakRemoval: () => {
        },
        afterInit: () => {
        }
      };
      this.config = {
        ...defaultConfig,
        ...config
      };
      this.config.beforeInit();
      this.waitForEnDefaults().then(() => {
        new ENXModel();
        new ENXProxyFields(this.config.proxies);
        this.config.beforeCloakRemoval();
        new ENXCloak();
        this.config.afterInit();
      });
    }
    waitForEnDefaults() {
      return new Promise((resolve) => {
        function checkEnDefaults() {
          if (window.EngagingNetworks.require._defined.enDefaults !== void 0) {
            resolve();
          } else {
            setTimeout(checkEnDefaults, 50);
          }
        }
        checkEnDefaults();
      });
    }
  };

  // src/index.js
  window.ENX = ENX;
  var src_default = ENX;
})();
