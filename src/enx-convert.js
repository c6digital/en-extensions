import { log } from "./helpers";

export default class ENXConvert {
  constructor() {
    if (!this.isEnabled()) return;

    if (!window.pageJson) {
      log("No pageJson found, not running ENXConvert");
      return false;
    }

    //Load our Page objects
    this.pages = this.getPagesLog();
    this.previousPage = this.pages[this.pages.length - 1] || null;
    this.currentPage = new Page(window.pageJson);
    this.updatePagesLog();

    //Stop here if already converted or using global override
    if (
      this.hasAlreadyConverted() ||
      (window.hasOwnProperty("ENConversion_DontConvert") &&
        window.ENConversion_DontConvert === true)
    ) {
      return;
    }

    //Do conversion if using global override
    if (window.hasOwnProperty("ENConversion_Convert") && window.ENConversion_Convert === true) {
      this.convert();
      return;
    }

    this.checkForConversion();
  }

  checkForConversion() {
    if (
      //last page of multiple pages without a redirect
      this.currentPage.isLastPage() &&
      this.currentPage.hasMoreThanOnePage() &&
      !this.currentPage.hasRedirect()
    ) {
      this.convert();
    } else if (
      //single page with redirect
      this.currentPage.isSinglePage() &&
      this.currentPage.hasRedirect()
    ) {
      this.convert();
    }
  }

  convert() {
    sessionStorage.setItem(
      "ENConversion_Converted_" + this.currentPage.pageJson.campaignId,
      "true"
    );

    log("ENXConvert: Converted");

    this.dispatchEvents();
  }

  dispatchEvents = function () {
    let groupEventName;
    switch (this.currentPage.pageJson.pageType) {
      case "donation":
      case "premiumgift":
      case "e-commerce":
        groupEventName = "donation";
        break;
      default:
        groupEventName = "submission";
        break;
    }

    const generalEvent = new Event("synthetic-en:conversion", { bubbles: true });
    const pageEvent = new Event("synthetic-en:conversion:" + this.currentPage.pageJson.pageType, {
      bubbles: true,
    });
    const groupEvent = new Event("synthetic-en:conversion:group:" + groupEventName, {
      bubbles: true,
    });

    dispatchEvent(generalEvent);
    dispatchEvent(pageEvent);
    dispatchEvent(groupEvent);
  };

  hasAlreadyConverted() {
    //Check if we have session variable for this campaign ID.
    return (
      sessionStorage.getItem("ENConversion_Converted_" + this.currentPage.pageJson.campaignId) !==
      null
    );
  }

  getPagesLog() {
    const pagesData = JSON.parse(sessionStorage.getItem("ENConversion_PagesLog"));
    if (pagesData === null) {
      return [];
    }
    return pagesData.map(function (pageData) {
      return new Page(pageData);
    });
  }

  updatePagesLog() {
    const pages = JSON.parse(sessionStorage.getItem("ENConversion_PagesLog"));
    if (pages === null) {
      sessionStorage.setItem("ENConversion_PagesLog", JSON.stringify([this.currentPage.pageJson]));
    } else {
      // Don't add to page log if it's the same as previous page (reloads, validation error, etc)
      if (!this.currentPage.isSamePageAs(this.previousPage)) {
        pages.push(this.currentPage.pageJson);
      }
      sessionStorage.setItem("ENConversion_PagesLog", JSON.stringify(pages));
    }
  }

  isEnabled() {
    return ENX.getConfigValue("enxConvert") !== false;
  }
}

class Page {
  /**
   * @param {
   *  {
   *    pageNumber: number,
   *    pageCount: number,
   *    redirectPresent: boolean,
   *    campaignPageId: number,
   *    campaignId: number,
   *    pageType: string
   *  }
   * } pageJson
   */
  constructor(pageJson) {
    this.pageJson = pageJson;
  }

  isLastPage() {
    return this.pageJson.pageNumber === this.pageJson.pageCount;
  }

  hasMoreThanOnePage() {
    return this.pageJson.pageCount > 1;
  }

  isSinglePage() {
    return this.pageJson.pageCount === 1;
  }

  hasRedirect() {
    return this.pageJson.redirectPresent;
  }

  hasPagesLeft() {
    return this.pageJson.pageNumber < this.pageJson.pageCount;
  }

  /**
   * A page to compare this page to
   * @param {Page} page
   */
  isSamePageAs(page) {
    return (
      this.pageJson.campaignPageId === page.pageJson.campaignPageId &&
      this.pageJson.pageNumber === page.pageJson.pageNumber
    );
  }
}
