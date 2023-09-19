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
}
