// * Varaiables and Imports
import { COUNTRY_LIST } from "./config.js";

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
const currency = document.querySelector(".currency");

// * Log-in feature: country
countrySelects.forEach((select) => {
  COUNTRY_LIST.forEach((country) => {
    const option = `<option name="country" value="${country}">${country}</option>`;
    select.insertAdjacentHTML("beforeend", option);
  });
});

// * Main page
logInForm.addEventListener("submit", function (e) {
  e.preventDefault();

  logInPage.classList.add("hidden");
  mainApp.classList.remove("hidden");

  // header
  welcomeMsg.textContent = "";
  userPeriod.textContent = "";

  welcomeMsg.innerHTML = `Welcome to <span class="user-country">${userDestination.value}</span>,
  <span class="user-name">${userName.value}</span>!`;

  userPeriod.innerHTML = `<span class="period-from">${new Intl.DateTimeFormat(
    navigator.language,
    { year: "numeric", month: "long", day: "numeric" }
  ).format(new Date(dateFrom.value))}</span> &mdash;
  <span class="period-to">${new Intl.DateTimeFormat(navigator.language, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateTo.value))}</span>`;
});

// * Initial ready cash, expense
readyCash.textContent = "0";
expense.textContent = "0";
exchangeResult.textContent = "0";

// * Country code function - 미완
const getCountryCode = async function (country) {
  try {
    const resCountry = await fetch(
      `https://restcountries.com/v3.1/name/${country}`
    );

    if (resCountry.status === 404)
      throw new Error(`Country Not Found ${response.status}`);

    const [dataCountry] = await resCountry.json();
    console.log(dataCountry);
  } catch (err) {
    console.error(err.message);
  }
};

getCountryCode("South Korea");

// * Get Currency symbol
const getCountryCurrency = async function (country) {
  try {
    const resCountry = await fetch(
      `https://restcountries.com/v3.1/name/${country}`
    );

    if (resCountry.status === 404)
      throw new Error(`Country Not Found ${response.status}`);

    const [dataCountry] = await resCountry.json();
    const { currencies } = dataCountry;

    const map = new Map(Object.entries(currencies));
    const { symbol } = [...map.values()][0];

    return symbol;
  } catch (err) {
    console.error(err.message);
  }
};

getCountryCurrency("South Korea");
getCountryCurrency("United States");
