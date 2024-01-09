/*
 * General enhancements for donation pages
 * Plus static helper methods related to donations
 */
import { getCurrency, getEnPageLocale } from "./helpers";

export default class ENXDonate {
  constructor() {
    this.removeEmptyDecimalFromTotalAmountSpans();
    this.addCurrencyToDonationOther();
  }

  removeEmptyDecimalFromTotalAmountSpans() {
    const amountTotalSpan = document.querySelector('span[data-token="amount-total"]');

    if (!amountTotalSpan) return;

    const updateAmountTotalSpans = () => {
      let decSeparator = ".";
      if (window.pageJson && window.pageJson.locale) {
        decSeparator = (1.1).toLocaleString(getEnPageLocale()).substring(1, 2);
      }

      document.querySelectorAll('span[data-token="amount-total"]').forEach((amountTotalSpan) => {
        amountTotalSpan.textContent = amountTotalSpan.textContent.replace(decSeparator + "00", "");
      });
    };

    updateAmountTotalSpans();

    const observer = new MutationObserver(updateAmountTotalSpans);
    observer.observe(amountTotalSpan, { subtree: true, childList: true });
  }

  addCurrencyToDonationOther() {
    document
      .querySelector(".en__field--donationAmt .en__field__item--other")
      ?.classList.add("amount-currency--" + getCurrency());
  }
}
