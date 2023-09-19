export default class ENXSpa {
  constructor() {
    this.currentStep = -1;
    this.spaTabs = [];

    this.init();
  }

  init() {
    this.resetTabs();
    this.onUrlHit();
    this.onBackButton();
    this.onClick();
  }

  resetTabs() {}

  onUrlHit() {}

  onBackButton() {}

  onClick() {}
}
