export const state = {
  user: {
    name: "",
    nationality: "",
    destination: "",
    travelPeriod: {
      from: "",
      to: "",
    },
  },

  asset: {
    readyCash: 0,
    totalExpense: 0,
    receipt: [],
  },

  currency: {
    symbol: "",
    userSymbol: "",
    exchangeRate: 0,
  },
};
