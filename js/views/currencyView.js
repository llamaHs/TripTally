class CurrencyView {
  currency = document.querySelectorAll(".currency");
  userCurrency = document.querySelector(".user-currency");
  readyCash = document.querySelector(".ready-cash-value");
  exchangeResult = document.querySelector(".rate-result-value");

  // * Display Currency symbol
  currencySymbolRender(symbol, userSymbol) {
    this.currency.forEach((cur) => (cur.textContent = symbol));
    this.userCurrency.textContent = userSymbol;
  }

  // * Display exchange result
  exchangeRender(result) {
    this.exchangeResult.textContent = result;
  }

  readyCashRender(money) {
    this.readyCash.textContent = money;
  }
}

export default new CurrencyView();
