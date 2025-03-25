// * Varaiables and Imports
import * as state from "./state.js";
import { COUNTRY_LIST } from "./config.js";
import headerMainView from "./views/headerMainView.js";
import currencyView from "./views/currencyView.js";
import expenseView from "./views/expenseView.js";

// temp.
import API from "./api.js";

const countrySelects = document.querySelectorAll("#country-from, #country");
const logInForm = document.querySelector(".log-in-form");
const userNation = document.querySelector("#country-from");
const userDestination = document.querySelector("#country");

// * Form submit - log in
const controlLogIn = function () {
  countrySelects.forEach((select) => {
    COUNTRY_LIST.forEach((country) => {
      const option = `<option name="country" value="${country}">${country}</option>`;
      select.insertAdjacentHTML("beforeend", option);
    });
  });

  logInForm.addEventListener("submit", function (e) {
    e.preventDefault();
    headerMainView.mainPageRender();
    headerMainView.headerRender();
  });

  headerMainView.initialAmount();
};

// * Form submit - currency symbol
const controlCurrency = function () {
  logInForm.addEventListener("submit", function (e) {
    e.preventDefault();
    currencyView.currencySymbolRender(userDestination.value, userNation.value);
  });
};

// * Display expense date
const controlExpenseDate = function () {
  logInForm.addEventListener("submit", function (e) {
    e.preventDefault();
    expenseView.expenseDateRender(userDestination.value);
  });
};

// * Calculate exchange rate
const calcExchangeRate = function () {};

// * Init
const init = function () {
  controlLogIn();
  controlCurrency();
  controlExpenseDate();
};

init();

// * temp.
API.getExchangeRate("South Korea", "United States");
