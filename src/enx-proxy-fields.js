/**
 * This class will bind the value of the target field to the value of the source field
 * and update it whenever source field's value changes.
 *
 * The constructor accepts an array of objects with the following structure:
 * {
 *   source: 'transaction.recurrpay',
 *   target: 'supporter.NOT_TAGGED_11'
 * }
 *
 * Fields can also be configured by giving the target field a label like this:
 * enx-proxy[SOURCE_FIELD_NAME] e.g. enx-proxy[transaction.recurrpay]
 */
import { getENFieldValue, getENSupporterData, log, setENFieldValue } from "./helpers";

export default class ENXProxyFields {
  constructor(proxies = []) {
    this.proxies = [...proxies, ...this.getProxyFieldsFromLabels()];

    if (this.shouldRun()) {
      this.activateProxyFields();
    }
  }

  shouldRun() {
    return this.proxies.length > 0;
  }

  getProxyFieldsFromLabels() {
    const proxyFields = [];
    const labels = document.querySelectorAll("label");

    labels.forEach((label) => {
      const labelText = label.textContent;
      if (labelText.includes("enx-proxy[")) {
        let source = /enx-proxy\[(.*)]/gi.exec(labelText);
        const target = document.getElementById(label.getAttribute("for"))?.getAttribute("name");
        if (source && target) {
          proxyFields.push({
            source: source[1],
            target: target,
          });
        }
      }
    });

    return proxyFields;
  }

  activateProxyFields() {
    this.proxies.forEach((proxy) => {
      const sourceField = proxy.source;
      const targetField = proxy.target;
      const targetFieldInput = document.querySelector(`[name="${targetField}"]`);
      const targetFieldContainer = targetFieldInput?.closest(".en__field");
      targetFieldContainer?.classList.add("enx-hidden");

      document.querySelectorAll(`[name="${sourceField}"]`).forEach((input) => {
        input.addEventListener("change", () => {
          setENFieldValue(targetField, getENFieldValue(sourceField));
          log(
            `Proxy field "${targetField}" updated with value "${getENFieldValue(
              sourceField
            )}" from "${sourceField}"`
          );
        });
      });

      setENFieldValue(targetField, getENFieldValue(sourceField));
      log(
        `Proxy field "${targetField}" updated with value "${getENFieldValue(
          sourceField
        )}" from "${sourceField}"`
      );
    });
  }
}
