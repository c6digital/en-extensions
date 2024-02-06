import { getComponentAttribute, getElementsOfComponent, getENSupporterData, log } from "./helpers";

export default class ENXShow {
  constructor() {
    this.init();
    this.legacyFunctionality();
  }

  init() {
    const elements = getElementsOfComponent("show");
    //set show or hide on page load based on default field values
    elements.forEach((element) => {
      const sourceFieldName = getComponentAttribute(element, "show", "field");
      const sourceFieldValue = getComponentAttribute(element, "show", "value");

      const inputs = document.getElementsByName(sourceFieldName);

      if (inputs.length === 0) {
        element.classList.add("enx-hidden");
      }

      inputs.forEach((input) => {
        if (input.type === "radio" || input.type === "checkbox") {
          if (input.value === sourceFieldValue && input.checked) {
            element.classList.remove("enx-hidden");
          } else {
            element.classList.add("enx-hidden");
          }
        } else if (input.value === sourceFieldValue) {
          element.classList.remove("enx-hidden");
        } else {
          element.classList.add("enx-hidden");
        }
      });
    });

    document.querySelector(".en__component--page")?.addEventListener("input", (e) => {
      const target = e.target;
      if (target.matches("input, select, textarea")) {
        this.checkShowHide(target.name, target.value);
      }
    });
  }

  checkShowHide(fieldName, fieldValue) {
    if (!fieldName || !fieldValue) return;

    // Special case for otherAmt
    if (fieldName === "transaction.donationAmt.other") {
      fieldName = "transaction.donationAmt";
    }

    const elements = getElementsOfComponent("show");

    elements.forEach((element) => {
      const sourceFieldName = getComponentAttribute(element, "show", "field");
      const sourceFieldValue = getComponentAttribute(element, "show", "value");

      if (sourceFieldName !== fieldName) return;

      if (sourceFieldValue === fieldValue) {
        log(
          `showing element with class enx-show[field=${sourceFieldName}][value=${sourceFieldValue}]`
        );
        element.classList.remove("enx-hidden");
      } else {
        log(
          `hiding element with class enx-show[field=${sourceFieldName}][value=${sourceFieldValue}]`
        );
        element.classList.add("enx-hidden");
      }
    });
  }

  //--------------------------------------------------------------------------------
  //Below is legacy functionality for backwards compatibility
  legacyFunctionality() {
    this.triggerPaymentType();
    this.triggerTaxDeductible();
    this.triggerRecurringPayment();
  }

  showElements(selector) {
    document.querySelectorAll(selector).forEach((element) => {
      element.classList.remove("enx-hidden");
    });
  }

  hideElements(selector) {
    document.querySelectorAll(selector).forEach((element) => {
      element.classList.add("enx-hidden");
    });
  }

  showRecurringPayment() {
    this.hideElements('[class*="show:recurring--"]');

    if (
      window.hasOwnProperty("isRegularDonorFlag") &&
      typeof window.isRegularDonorFlag !== "undefined"
    ) {
      this.showElements(".show\\:recurring--monthly");
      return;
    }

    const val = getENSupporterData("transaction.recurrpay");
    if (val === "Y") {
      this.showElements(".show\\:recurring--monthly");
      return;
    } else if (val === "N") {
      this.showElements(".show\\:recurring--single");
    }

    this.showElements(".show\\:recurring--monthly-false");
  }

  triggerRecurringPayment() {
    this.showRecurringPayment();

    const recurringPaymentRadios = document.querySelectorAll(
      'input[type=radio][name="transaction.recurrpay"]'
    );

    recurringPaymentRadios.forEach((element) => {
      element.addEventListener("change", () => {
        this.showRecurringPayment();
      });
    });
  }

  showTaxDeductible() {
    this.hideElements("[class*='show:giftaid--']");

    const val = getENSupporterData("transaction.taxdeductible");

    if (val === "Y") {
      this.showElements(".show\\:giftaid--Y");
    } else if (val === "N") {
      this.showElements(".show\\:giftaid--N");
    }
  }

  triggerTaxDeductible() {
    // Change Event
    document.querySelectorAll("input[name='transaction.taxdeductible']").forEach((el) => {
      el.addEventListener("change", () => {
        this.showTaxDeductible();
      });
    });

    /* Page load */
    setTimeout(() => {
      this.showTaxDeductible();
    }, 500);
  }

  showPaymentType() {
    this.hideElements("[class*='show:payment--']");

    const val = getENSupporterData("transaction.paymenttype");

    switch (val) {
      case "card":
        this.showElements(".show\\:payment--card");
        break;
      case "paypal":
        this.showElements(".show\\:payment--paypal");
        break;
      case "bacs_debit":
      case "cash":
        this.showElements(".show\\:payment--directdebit");
        break;
      default:
        return;
    }
  }

  triggerPaymentType() {
    /* On DOM Insert */
    document.querySelectorAll(".en__field--paymenttype").forEach((el) => {
      ["DOMNodeInserted", "change"].forEach((event) => {
        el.addEventListener(event, () => {
          const invokePaymentChange = () => {
            setTimeout(() => {
              this.showPaymentType();
            }, 500);
          };

          invokePaymentChange();

          const paymentTypeRadios = document.querySelectorAll(
            'input[type=radio][name="transaction.paymenttype"]'
          );
          paymentTypeRadios.forEach(function (element) {
            element.addEventListener("change", invokePaymentChange);
          });
        });
      });
    });

    // On Change Event
    const paymentTypeRadios = document.querySelectorAll(
      'input[type=radio][name="transaction.paymenttype"]'
    );
    paymentTypeRadios.forEach((element) => {
      element.addEventListener("change", () => {
        this.showPaymentType();
      });
    });

    /* Page load */
    setTimeout(() => {
      this.showPaymentType();
    }, 500);
  }
}
