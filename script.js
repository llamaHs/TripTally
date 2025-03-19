// Varaiables and Imports
import { COUNTRY_LIST } from "./config.js";

const countrySelects = document.querySelectorAll("#country-from, #country");

// Log-in feature
countrySelects.forEach((select) => {
  COUNTRY_LIST.forEach((country) => {
    const option = `<option value="${country}">${country}</option>`;
    select.insertAdjacentHTML("beforeend", option);
  });
});
