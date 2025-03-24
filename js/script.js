// * Varaiables and Imports
import { COUNTRY_LIST } from "./config.js";
import headerMainView from "./views/headerMainView.js";
import currencyView from "./views/currencyView.js";
import expenseView from "./views/expenseView.js";

const countrySelects = document.querySelectorAll("#country-from, #country");

// Log-in
const logInForm = document.querySelector(".log-in-form");
const mainApp = document.querySelector(".app");
const logInPage = document.querySelector(".log-in");

const welcomeMsg = document.querySelector(".welcome-msg");
const userPeriod = document.querySelector(".user-period");

const userName = document.querySelector("#name");
const userNation = document.querySelector("#country-from");
const userDestination = document.querySelector("#country");
const dateFrom = document.getElementById("date-from");
const dateTo = document.getElementById("date-to");

const readyCash = document.querySelector(".ready-cash-value");
const expense = document.querySelector(".receipt-expense-value");
const exchangeResult = document.querySelector(".rate-result-value");

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

// * Init
const init = function () {
  controlLogIn();
  controlCurrency();
  controlExpenseDate();
};

init();
