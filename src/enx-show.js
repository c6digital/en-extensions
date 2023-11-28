import { getENSupporterData } from "./helpers";

export default class ENXShow {
  constructor() {
    this.init();
    this.legacyFunctionality();
  }

  init() {
    //set show or hide on page load based on default field values
    document.querySelectorAll('[class*="enx-show:"]').forEach((conditionalEl) => {
      const conditionalClass = this.getConditionalClassFromElement(conditionalEl);
      const classDetails = this.getMatchDetailsFromClass(conditionalClass);

      if (!classDetails) return;

      const inputs = document.getElementsByName(classDetails.fieldName);

      if (inputs.length === 0) {
        conditionalEl.classList.add("enx-hidden");
      }

      inputs.forEach((input) => {
        if (input.type === "radio" || input.type === "checkbox") {
          if (input.value === classDetails.fieldValue && input.checked) {
            conditionalEl.classList.remove("enx-hidden");
          } else {
            conditionalEl.classList.add("enx-hidden");
          }
        } else if (input.value === classDetails.fieldValue) {
          conditionalEl.classList.remove("enx-hidden");
        } else {
          conditionalEl.classList.add("enx-hidden");
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

    const conditionalEls = document.querySelectorAll('[class*="enx-show:"]');

    conditionalEls.forEach((conditionalEl) => {
      const conditionalClass = this.getConditionalClassFromElement(conditionalEl);
      const classDetails = this.getMatchDetailsFromClass(conditionalClass);

      //If no match or the match is not the current field, skip
      if (!classDetails || classDetails.fieldName !== fieldName) return;

      if (classDetails.fieldValue === fieldValue) {
        conditionalEl.classList.remove("enx-hidden");
      } else {
        conditionalEl.classList.add("enx-hidden");
      }
    });
  }

  getConditionalClassFromElement(conditionalEl) {
    return conditionalEl.className.split(" ").find((className) => className.includes("enx-show:"));
  }

  getMatchDetailsFromClass(conditionalClass) {
    //Expecting: enx-show:fieldName[fieldValue]
    const regex = /enx-show:([^[]+)\[([^[]+)]/g;
    const match = regex.exec(conditionalClass);

    if (!match) return null;

    return {
      fieldName: match[1],
      fieldValue: match[2],
    };
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

    const val = getENSupporterData("recurrpay");
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

    const val = getENSupporterData("taxdeductible");

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

    const val = getENSupporterData("paymenttype");

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
