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

        await expenseView.expenseDateRender(state.user.destination);
      });
    });
  }

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

  updateReadyCash(amount) {
    // Update state
    state.asset.readyCash = parseFloat(
      (state.asset.readyCash + amount).toFixed(2)
    );

    // Update UI
    currencyView.readyCashRender(state.asset.readyCash);

    console.log(state);
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

// * Init
const init = function () {
  controlLogIn();
  updateState.updateUser();
  calcExchange();
  addExpense();
  sortRecipt();
};
init();
