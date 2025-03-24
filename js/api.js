import { API_COUNTRY_URL } from "./config.js";

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
}

export default new API();
