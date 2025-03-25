import {
  API_COUNTRY_URL,
  API_CURRENCY_URL,
  API_CURRENCY_BACKUP_URL,
} from "./config.js";

class API {
  // * Get Country code
  async getCountryCode(country) {
    try {
      const resCountry = await fetch(`${API_COUNTRY_URL}${country}`);

      if (resCountry.status === 404)
        throw new Error(`Country Not Found ${resCountry.status}`);

      const [dataCountry] = await resCountry.json();

      const langCode = Object.keys(dataCountry.languages)[0].slice(0, 2);
      const countryCode = dataCountry.cca2;

      return `${langCode}-${countryCode}`;
    } catch (err) {
      console.error(err.message);
    }
  }

  // * Get Currency symbol
  async getCurrencySymbol(country) {
    try {
      const resCountry = await fetch(`${API_COUNTRY_URL}${country}`);

      if (resCountry.status === 404)
        throw new Error(`Country Not Found ${resCountry.status}`);

      const [dataCountry] = await resCountry.json();
      const { currencies } = dataCountry;

      const map = Object.values(currencies);
      const { symbol } = [...map][0];

      if (!symbol) throw new Error(`Can't find the currency symbol`);

      return symbol;
    } catch (err) {
      console.error(err.message);
    }
  }

  // * Get Currency code
  async getCurrencyCode(country) {
    try {
      const resCountry = await fetch(`${API_COUNTRY_URL}${country}`);

      if (resCountry.status === 404)
        throw new Error(`Country Not Found ${resCountry.status}`);

      const [dataCountry] = await resCountry.json();
      const { currencies } = dataCountry;

      const currencyCode = Object.keys(currencies)[0];
      return currencyCode;
    } catch (err) {
      console.error(err.message);
    }
  }

  // * Get exchange rate
  async getExchangeRate(userCountry, country) {
    try {
      // user's nation exchange rate
      const userCurrencyCode = (
        await this.getCurrencyCode(userCountry)
      ).toLowerCase();

      const resRate = await fetch(
        `${API_CURRENCY_URL}${userCurrencyCode}.json`
      );

      if (resRate.status === 404)
        throw new Error(`Exchange rate not found ${resRate.status}`);

      const dataRate = await resRate.json();
      const rateList = Object.values(dataRate)[1];

      if (!rateList) {
        country = "United States";
      }

      // destination exchange rate
      const currencyCode = (await this.getCurrencyCode(country)).toLowerCase();

      const exchangeRate = rateList[currencyCode];
      return exchangeRate;
    } catch (err) {
      console.error(err.message);
    }

    // !Fallback!
    try {
      // user's nation exchange rate
      const userCurrencyCode = (
        await this.getCurrencyCode(userCountry)
      ).toLowerCase();

      const resRate = await fetch(
        `${API_CURRENCY_BACKUP_URL}${userCurrencyCode}.json`
      );

      if (resRate.status === 404)
        throw new Error(`Exchange rate not found ${resRate.status}`);

      const dataRate = await resRate.json();
      const rateList = Object.values(dataRate)[1];

      if (!rateList) {
        country = "United States";
      }

      // destination exchange rate
      const currencyCode = (await this.getCurrencyCode(country)).toLowerCase();

      const exchangeRate = rateList[currencyCode];
      return exchangeRate;
    } catch (err) {
      console.error(err.message);
    }
  }
}

export default new API();
