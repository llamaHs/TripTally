import API from "../api.js";

class CurrencyView {
  currency = document.querySelectorAll(".currency");
  userCurrency = document.querySelector(".user-currency");

  // * Display Currency symbol
  currencySymbolRender(country, userCountry) {
    API.getCurrencySymbol(country).then((symbol) => {
      this.currency.forEach((cur) => (cur.textContent = symbol));
    });

    API.getCurrencySymbol(userCountry).then(
      (symbol) => (this.userCurrency.textContent = symbol)
    );
  }
}

export default new CurrencyView();
