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

const periodFrom = document.querySelector(".period-from");
const periodTo = document.querySelector(".period-to");

// * Log-in feature
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
