/**
 * This class will bind the value of the target field to the value of the source field
 * and update it whenever source field's value changes.
 *
 * The constructor accepts an array of objects with the following structure:
 * {
 *   source: 'transaction.recurrpay',
 *   target: 'supporter.NOT_TAGGED_11'
 * }
 */
import { getENSupporterData, setENFieldValue } from "./helpers";

export default class ENXProxyFields {
  constructor(proxies = []) {
    this.proxies = proxies;

    if (this.shouldRun()) {
      this.activateProxyFields();
    }
  }

  shouldRun() {
    return this.proxies.length > 0;
  }

  activateProxyFields() {
    this.proxies.forEach((proxy) => {
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
}
