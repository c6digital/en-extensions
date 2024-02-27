import { getCampaignData, log } from "./helpers";

export default class ENXWidget {
  constructor(config) {
    if (!this.isEnabled()) return;
    this.config = typeof config === "object" ? config : {};
    this.setupEnProgressBarWidget();
  }

  isEnabled() {
    return ENX.getConfigValue("enxWidget") !== false;
  }

  async setupEnProgressBarWidget() {
    const thermometer = document.querySelector(".enWidget.enWidget--progressBar");
    const counterText = document.querySelector(".signature-counter");

    if (!thermometer && !counterText) {
      log("ENXWidget: No progress bar or counter text found, skipping widget setup");
      return;
    }

    thermometer?.classList.add("enx-hidden");
    counterText?.classList.add("enx-hidden");

    const campaignId = window.pageJson && window.pageJson.campaignId;
    const apiService = this.config.type === "petition" ? "EaDataCapture" : "FundraisingSummary";

    const responseData = await getCampaignData(campaignId, apiService, this.config.token);

    if (!responseData || !responseData.rows) {
      log("ENXWidget: No API response found, skipping widget setup");
      return;
    }

    const responseCount = responseData.rows[0].columns.find(
      (column) => column.name === this.config.metric
    ).value;

    const totalCount = parseInt(responseCount || 0) + this.config.offsetCount;

    if (!totalCount) {
      log("ENXWidget: No total count found in API response, skipping widget setup");
      return;
    }

    if (this.config.hiddenUntilCount && this.config.hiddenUntilCount > totalCount) {
      log(
        `ENXWidget: Total count ${totalCount} is less than hiddenUntilCount, skipping widget setup`
      );
      return;
    }

    const target = this.getTarget(totalCount);
    const remaining = target - totalCount;
    const percent = ((totalCount * 100) / target).toFixed(0) + "%";

    // set signature text
    if (counterText) {
      counterText.innerHTML = counterText.innerHTML
        .replace("{signature.remaining}", remaining.toLocaleString())
        .replace("{signature.percent}", percent)
        .replace("{signature.count}", totalCount.toLocaleString())
        .replace("{signature.target}", target.toLocaleString());

      counterText.classList.remove("enx-hidden");
    }

    // set thermometer
    if (thermometer) {
      const thermometerFill = thermometer.querySelector(".enWidget__fill");
      if (thermometerFill) {
        thermometerFill.style.width = "0%";
        thermometerFill.style.height = "100%";
        thermometer.classList.remove("enx-hidden");
        thermometerFill.style.width = percent;
        thermometer.classList.remove("enx-hidden");
      }
    }

    log(
      `ENXWidget: ${totalCount} signatures, ${target} target, ${remaining} remaining, ${percent} complete`
    );
  }

  getTarget(signatureCount) {
    const signatureNumber = parseInt(signatureCount) * 1.05;
    let target = Math.ceil(signatureNumber / 500000) * 500000;
    if (signatureNumber < 15000) {
      target = Math.ceil(signatureNumber / 5000) * 5000;
    } else if (signatureNumber < 50000) {
      target = Math.ceil(signatureNumber / 10000) * 10000;
    } else if (signatureNumber < 200000) {
      target = Math.ceil(signatureNumber / 50000) * 50000;
    } else if (signatureNumber < 500000) {
      target = Math.ceil(signatureNumber / 100000) * 100000;
    }
    return target;
  }
}
