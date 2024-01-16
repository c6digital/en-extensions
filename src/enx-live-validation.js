import { log } from "./helpers";
import {
  DefaultCreditCardDelimiter,
  formatCreditCard,
  formatGeneral,
  formatNumeral,
  registerCursorTracker,
} from "cleave-zen";

export default class ENXLiveValidation {
  constructor(config) {
    this.config = config;

    if (this.shouldRun()) {
      this.email();
      this.creditCard();
      this.cvv();
      this.sortCode(this.config.sortCodeField);
      this.accountNumber(this.config.accountNumberField);
      this.amountOther();
      this.noSpaces(".validate-no-spaces");
    }
  }

  shouldRun() {
    return this.config.enabled;
  }

  email(field = "#en__field_supporter_emailAddress") {
    this.noSpaces(field);
  }

  creditCard(field = "#en__field_transaction_ccnumber") {
    const creditCardInput = document.querySelector(field);

    if (creditCardInput) {
      registerCursorTracker({
        input: creditCardInput,
        delimiter: DefaultCreditCardDelimiter,
      });

      creditCardInput.addEventListener("input", (e) => {
        const value = e.target.value;
        creditCardInput.value = formatCreditCard(value);
        log(`Credit Card: ${value}, formatted to: ${creditCardInput.value}`);
      });
    }
  }

  cvv(field = "#en__field_transaction_ccvv") {
    const cvvInput = document.querySelector(field);

    cvvInput?.addEventListener("input", (e) => {
      const value = e.target.value;
      cvvInput.value = formatGeneral(value, {
        numericOnly: true,
        blocks: [4],
      });
      log(`CVV: ${value}, formatted to: ${cvvInput.value}`);
    });
  }

  sortCode(field) {
    const sortCodeField = document.getElementsByName(field)[0];

    if (sortCodeField) {
      registerCursorTracker({
        input: sortCodeField,
        delimiter: "-",
      });

      sortCodeField.addEventListener("input", (e) => {
        const value = e.target.value;
        sortCodeField.value = formatGeneral(value, {
          delimiter: "-",
          blocks: [2, 2, 2],
          numericOnly: true,
        });
        log(`Sort Code: ${value}, formatted to: ${sortCodeField.value}`);
      });
    }
  }

  accountNumber(field) {
    const accountNumberField = document.getElementsByName(field)[0];

    if (accountNumberField) {
      accountNumberField.addEventListener("input", (e) => {
        const value = e.target.value;
        accountNumberField.value = formatGeneral(value, {
          blocks: [8],
          numericOnly: true,
        });
        log(`Account Number: ${value}, formatted to: ${accountNumberField.value}`);
      });
    }
  }

  amountOther(field = "transaction.donationAmt.other") {
    const otherAmountField = document.getElementsByName(field)[0];

    if (otherAmountField) {
      otherAmountField.addEventListener("input", (e) => {
        const value = e.target.value;
        otherAmountField.value = formatNumeral(value, {
          numeralThousandsGroupStyle: "none",
        });
        log(`Amount Other: ${value}, formatted to: ${otherAmountField.value}`);
      });
    }
  }

  noSpaces(field = "") {
    const fields = document.querySelectorAll(field);
    fields.forEach((field) => {
      field.addEventListener("input", () => {
        field.value = field.value.replace(/\s+/g, "");
      });
    });
  }
}
