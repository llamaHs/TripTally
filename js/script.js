// * Varaiables and Imports
import { state } from "./state.js";
import API from "./api.js";
import { COUNTRY_LIST } from "./config.js";
import headerMainView from "./views/headerMainView.js";
import currencyView from "./views/currencyView.js";
import expenseView from "./views/expenseView.js";

const countrySelects = document.querySelectorAll("#country-from, #country");
const logInForm = document.querySelector(".log-in-form");
const userName = document.querySelector("#name");
const dateFrom = document.getElementById("date-from");
const dateTo = document.getElementById("date-to");
const userNation = document.querySelector("#country-from");
const userDestination = document.querySelector("#country");

const exchangeAmount = document.querySelector(".amount");
const btnCalc = document.querySelector(".btn-calc");
const btnAdd = document.querySelector(".btn-add");

// if (module.hot) {
//   module.hot.accept();
// }

// * Setting country on the form
const controlLogIn = function () {
  countrySelects.forEach((select) => {
    COUNTRY_LIST.forEach((country) => {
      const option = `<option name="country" value="${country}">${country}</option>`;
      select.insertAdjacentHTML("beforeend", option);
    });
  });
};

// * Update state + UI
class UpdateState {
  async updateUser() {
    document.addEventListener("DOMContentLoaded", () => {
      logInForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Update user info
        state.user.name = userName.value;
        state.user.nationality = userNation.value;
        state.user.destination = userDestination.value;
        state.user.travelPeriod.from = dateFrom.value;
        state.user.travelPeriod.to = dateTo.value;

        // Update currency info
        await this.updateCurrency();

        console.log(state);

        // Update UI
        headerMainView.mainPageRender();
        headerMainView.headerRender(
          state.user.name,
          state.user.destination,
          state.user.travelPeriod.from,
          state.user.travelPeriod.to
        );
        headerMainView.initialAmount();

        expenseView.expenseDateRender(state.user.destination);
      });
    });
  }

  updateAsset() {}

  async updateCurrency() {
    try {
      const symbol = await API.getCurrencySymbol(state.user.destination);
      const userSymbol = await API.getCurrencySymbol(state.user.nationality);
      const exchangeRate = await API.getExchangeRate(
        state.user.nationality,
        state.user.destination
      );

      state.currency.symbol = symbol;
      state.currency.userSymbol = userSymbol;
      state.currency.exchangeRate = +exchangeRate;

      // Update UI
      currencyView.currencySymbolRender(
        state.currency.symbol,
        state.currency.userSymbol
      );
    } catch (err) {
      console.error("Failed to update currency", err);
    }
  }
}

const updateState = new UpdateState();

// * Calculate exchange rate + Add ready cash
const calcExchange = function () {
  updateState.updateUser();

  btnCalc.addEventListener("click", (e) => {
    e.preventDefault();

    const exchangeResult = +(
      exchangeAmount.value.trim() * state.currency.exchangeRate
    ).toFixed(2);

    console.log(exchangeResult);
    currencyView.exchangeRender(exchangeResult);

    btnAdd.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        if (e.key === "Enter") return;

        state.asset.readyMoney = parseFloat(
          (state.asset.readyMoney + exchangeResult).toFixed(2)
        );
        console.log(state.asset.readyMoney);
        currencyView.readyCashRender(state.asset.readyMoney);
      },
      { once: true }
    );
  });
};

// * Init
const init = function () {
  controlLogIn();
  updateState.updateUser();
  calcExchange();
};
init();

// * temp. (main page reload)
const logo = document.querySelector(".logo");

logo.addEventListener("click", () => {
  headerMainView.mainPageRender();
  headerMainView.headerRender(
    state.user.name,
    state.user.destination,
    state.user.travelPeriod.from,
    state.user.travelPeriod.to
  );

  headerMainView.initialAmount();
  exchangeAmount.value = "";
});
