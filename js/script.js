// * Varaiables and Imports
import { state, saveUserInfo, getUserInfo } from "./state.js";
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
const exchangeResultUI = document.querySelector(".rate-result-value");

const expenseItem = document.querySelector(".expense-item");
const expenseAmount = document.querySelector(".expense-value");
const checkCash = document.querySelector("#cash");
const checkCard = document.querySelector("#card");
const btnExpense = document.querySelector(".btn-spending");

const btnSortCash = document.querySelector(".btn-filter-cash");
const btnSortCard = document.querySelector(".btn-filter-card");
const btnSortOld = document.querySelector(".btn-sort");

let isSorted = { cash: false, card: false, old: false };

// * Setting country on the form
function loadLogInCountries() {
  countrySelects.forEach((select) => {
    COUNTRY_LIST.forEach((country) => {
      const option = `<option name="country" value="${country}">${country}</option>`;
      select.insertAdjacentHTML("beforeend", option);
    });
  });
}

// * Update state + UI
class UpdateState {
  async updateUser(userInfo) {
    // Update user info
    state.user.name = userInfo.name;
    state.user.nationality = userInfo.nationality;
    state.user.destination = userInfo.destination;
    state.user.travelPeriod.from = userInfo.travelPeriod.from;
    state.user.travelPeriod.to = userInfo.travelPeriod.to;

    // Update currency info
    await this.updateCurrency();

    // Update UI
    headerMainView.mainPageRender();
    headerMainView.headerRender(
      state.user.name,
      state.user.destination,
      state.user.travelPeriod.from,
      state.user.travelPeriod.to
    );

    await expenseView.expenseDateRender(state.user.destination);
    saveUserInfo();
  }

  async updateCurrency() {
    try {
      if (!state.user.destination || !state.user.nationality) return;

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

      saveUserInfo();
    } catch (err) {
      console.error("Failed to update currency", err);
    }
  }

  async updateCurrencyState() {
    await this.updateCurrency();
  }

  updateReadyCash(amount) {
    // Update state
    state.asset.readyCash = parseFloat(
      (state.asset.readyCash + amount).toFixed(2)
    );

    // Update UI
    currencyView.readyCashRender(state.asset.readyCash);

    saveUserInfo();
  }

  updateExpense(newExpense) {
    // Update state + UI
    state.asset.receipt.push(newExpense);
    expenseView.receiptRender(state.asset.receipt, state.user.destination);

    // Update total expense
    state.asset.totalExpense = parseFloat(
      (state.asset.totalExpense + Number(newExpense.price)).toFixed(2)
    );

    expenseView.totalExpenseRender(state.asset.totalExpense);

    saveUserInfo();
  }

  updateSort(type) {
    let sortedReceipt = state.asset.receipt;

    // sort by cash
    if (type === "cash") {
      isSorted.cash = !isSorted.cash;
      isSorted.card = false;
      isSorted.old = false;

      sortedReceipt = isSorted.cash
        ? state.asset.receipt.filter((expense) => expense.pay === "cash")
        : state.asset.receipt;
    }

    // sort by card
    if (type === "card") {
      isSorted.cash = false;
      isSorted.card = !isSorted.card;
      isSorted.old = false;

      sortedReceipt = isSorted.card
        ? state.asset.receipt.filter((expense) => expense.pay === "card")
        : state.asset.receipt;
    }

    // sort by oldest/lastest
    if (type === "old") {
      isSorted.cash = false;
      isSorted.card = false;
      isSorted.old = !isSorted.old;

      sortedReceipt = isSorted.old
        ? state.asset.receipt.slice().reverse()
        : state.asset.receipt;
    }

    // Update UI
    expenseView.receiptRender(sortedReceipt, state.user.destination);
    expenseView.sortBtnRender(isSorted);
  }
}

const updateState = new UpdateState();

// * Log-in
const controlLogIn = function () {
  document.addEventListener("DOMContentLoaded", () => {
    logInForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const userInfo = {
        name: userName.value,
        nationality: userNation.value.trim(),
        destination: userDestination.value.trim(),
        travelPeriod: {
          from: dateFrom.value,
          to: dateTo.value,
        },
      };

      // Update state + show main page
      await updateState.updateUser(userInfo);
      saveUserInfo();
      headerMainView.initialAmount();
    });
  });
};

// * Calculate exchange rate + Add ready cash
const calcExchange = async function () {
  await updateState.updateCurrencyState();

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

        // update State + UI
        updateState.updateReadyCash(exchangeResult);

        // Empty input field + exchange result
        exchangeAmount.value = "";
        exchangeResultUI.textContent = 0;
      },
      { once: true }
    );
  });
};

// * Add Expense + Update UI + Update state
const addExpense = function () {
  btnExpense.addEventListener("click", (e) => {
    e.preventDefault();

    // Make new expense object
    const newExpense = {
      item: expenseItem.value,
      price: Number(expenseAmount.value),
      pay: checkCash.checked ? checkCash.value : "card",
    };

    // update state + UI
    updateState.updateExpense(newExpense);

    if (checkCash.checked) {
      updateState.updateReadyCash(-Number(newExpense.price));
    }

    checkCash.checked = checkCard.checked = false;
    expenseItem.value = expenseAmount.value = "";
  });
};

// * Sort
const sortRecipt = function () {
  btnSortCash.addEventListener("click", (e) => updateState.updateSort("cash"));

  btnSortCard.addEventListener("click", (e) => updateState.updateSort("card"));

  btnSortOld.addEventListener("click", (e) => updateState.updateSort("old"));
};

// * Render saved user info
const renderSavedInfo = function () {
  window.addEventListener("load", async () => {
    const savedInfo = getUserInfo();

    if (!savedInfo) return;

    if (savedInfo) {
      const savedState = Object.assign(state, savedInfo);
      await updateState.updateUser(savedState.user);

      currencyView.readyCashRender(savedState.asset.readyCash);
      expenseView.receiptRender(
        savedState.asset.receipt,
        savedState.user.destination
      );
      expenseView.totalExpenseRender(savedState.asset.totalExpense);

      headerMainView.reloadRender();
    }
  });
};

// * Init
const init = function () {
  loadLogInCountries();
  controlLogIn();
  renderSavedInfo();
  calcExchange();
  addExpense();
  sortRecipt();
};

init();
